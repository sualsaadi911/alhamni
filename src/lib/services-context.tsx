"use client";
import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";
import { auditLog } from "./audit-log";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  image?: string;
  details?: string;
  isActive: boolean;
  createdAt: string | null;
  createdBy: string;
}

export type RequestStatus = "pending" | "reviewing" | "accepted" | "completed" | "rejected";

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status: RequestStatus;
  createdAt: string | null;
  note?: string;
}

interface ServicesContextValue {
  services: Service[];
  requests: ServiceRequest[];
  loading: boolean;
  addService: (data: Omit<Service, "id" | "createdAt" | "createdBy">) => Promise<void>;
  updateService: (id: string, data: Partial<Omit<Service, "id">>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  submitRequest: (data: Omit<ServiceRequest, "id" | "createdAt" | "status">) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => Promise<void>;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

function mapService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as string,
    icon: row.icon as string,
    image: row.image as string | undefined,
    details: row.details as string | undefined,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string | null,
    createdBy: row.created_by as string,
  };
}

function mapRequest(row: Record<string, unknown>): ServiceRequest {
  return {
    id: row.id as string,
    serviceId: row.service_id as string,
    serviceTitle: row.service_title as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    details: row.details as string,
    status: row.status as RequestStatus,
    createdAt: row.created_at as string | null,
    note: row.note as string | undefined,
  };
}

export function ServicesProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setServices(data.map(mapService));
        setLoading(false);
      });

    const servicesSub = supabase
      .channel("services")
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => {
        supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => { if (data) setServices(data.map(mapService)); });
      })
      .subscribe();

    supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setRequests(data.map(mapRequest));
      });

    const requestsSub = supabase
      .channel("service_requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "service_requests" }, () => {
        supabase
          .from("service_requests")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => { if (data) setRequests(data.map(mapRequest)); });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(servicesSub);
      supabase.removeChannel(requestsSub);
    };
  }, []);

  const addService = useCallback(async (data: Omit<Service, "id" | "createdAt" | "createdBy">) => {
    await supabase.from("services").insert({
      title: data.title,
      description: data.description,
      category: data.category,
      icon: data.icon,
      image: data.image,
      details: data.details,
      is_active: data.isActive,
      created_by: profile?.uid ?? "",
    });
    auditLog.add({ actorUid: profile?.uid ?? "", actorName: profile?.name ?? "", actorRole: profile?.role ?? "media", action: "content_published", targetName: data.title });
  }, [profile]);

  const updateService = useCallback(async (id: string, data: Partial<Omit<Service, "id">>) => {
    const row: Record<string, unknown> = {};
    if (data.title !== undefined) row.title = data.title;
    if (data.description !== undefined) row.description = data.description;
    if (data.category !== undefined) row.category = data.category;
    if (data.icon !== undefined) row.icon = data.icon;
    if (data.image !== undefined) row.image = data.image;
    if (data.details !== undefined) row.details = data.details;
    if (data.isActive !== undefined) row.is_active = data.isActive;
    await supabase.from("services").update(row).eq("id", id);
    auditLog.add({ actorUid: profile?.uid ?? "", actorName: profile?.name ?? "", actorRole: profile?.role ?? "media", action: "content_updated", targetName: data.title ?? id });
  }, [profile]);

  const deleteService = useCallback(async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    auditLog.add({ actorUid: profile?.uid ?? "", actorName: profile?.name ?? "", actorRole: profile?.role ?? "media", action: "content_updated", targetName: id });
  }, [profile]);

  const submitRequest = useCallback(async (data: Omit<ServiceRequest, "id" | "createdAt" | "status">) => {
    await supabase.from("service_requests").insert({
      service_id: data.serviceId,
      service_title: data.serviceTitle,
      name: data.name,
      email: data.email,
      phone: data.phone,
      details: data.details,
      status: "pending",
    });
  }, []);

  const updateRequestStatus = useCallback(async (id: string, status: RequestStatus, note?: string) => {
    await supabase.from("service_requests").update({ status, ...(note ? { note } : {}) }).eq("id", id);
    auditLog.add({ actorUid: profile?.uid ?? "", actorName: profile?.name ?? "", actorRole: profile?.role ?? "media", action: "content_updated", targetName: `${id} → ${status}` });
  }, [profile]);

  return (
    <ServicesContext.Provider value={{
      services, requests, loading,
      addService, updateService, deleteService,
      submitRequest, updateRequestStatus,
    }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within ServicesProvider");
  return ctx;
}

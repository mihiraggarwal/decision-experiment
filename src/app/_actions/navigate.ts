"use server";

import { redirect } from "next/navigation";

export default async function navigate(route: string) {
    redirect(route)
}
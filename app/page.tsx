import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Crear handler usando las opciones importadas
const handler = NextAuth(authOptions)

// Exportar solo los métodos GET y POST para la API route
export { handler as GET, handler as POST }
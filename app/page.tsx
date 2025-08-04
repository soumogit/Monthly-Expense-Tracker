import { AuthProvider } from "../contexts/auth-context"
import App from "../app"

export default function Page() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

import { PageLayout } from "../../components/layout/PageLayout"
import { Link } from "react-router-dom"

export default function ProviderDashboard() {
  return (
    <PageLayout title="Provider Dashboard">

      <div className="grid md:grid-cols-2 gap-6">

        <Link to="/provider/create-service" className="card-glass p-6 hover:scale-[1.02] transition">
          <h3 className="text-xl font-semibold gold-text">Create Service</h3>
          <p className="text-obsidian-400 mt-2">Add a new service for clients</p>
        </Link>

        <Link to="/provider/services" className="card-glass p-6 hover:scale-[1.02] transition">
          <h3 className="text-xl font-semibold gold-text">Manage Services</h3>
          <p className="text-obsidian-400 mt-2">Edit services & manage slots</p>
        </Link>

      </div>

    </PageLayout>
  )
}
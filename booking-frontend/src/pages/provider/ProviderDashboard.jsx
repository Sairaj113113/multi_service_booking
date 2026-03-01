import { PageLayout } from "../../components/layout/PageLayout"
import { Link } from "react-router-dom"

export default function ProviderDashboard() {
  return (
    <PageLayout title="Provider Dashboard">

      <div className="grid gap-8 lg:grid-cols-2">

        <Link
          to="/provider/create-service"
          className="card-glass group flex min-h-[240px] flex-col justify-between p-8 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold-400/40"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-obsidian-400">
              Quick Action
            </p>
            <h3 className="mt-3 text-2xl font-semibold gold-text">Create Service</h3>
            <p className="mt-3 text-obsidian-400">
              Add a new service, set pricing, and publish instantly.
            </p>
          </div>
          <span className="mt-8 inline-flex w-fit items-center rounded-lg border border-gold-400/40 px-4 py-2 text-sm text-gold-300 group-hover:border-gold-400">
            Start creating
          </span>
        </Link>

        <Link
          to="/provider/services"
          className="card-glass group flex min-h-[240px] flex-col justify-between p-8 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold-400/40"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-obsidian-400">
              Manage
            </p>
            <h3 className="mt-3 text-2xl font-semibold gold-text">Manage Services</h3>
            <p className="mt-3 text-obsidian-400">
              Update details, manage slots, and keep availability fresh.
            </p>
          </div>
          <span className="mt-8 inline-flex w-fit items-center rounded-lg border border-gold-400/40 px-4 py-2 text-sm text-gold-300 group-hover:border-gold-400">
            View services
          </span>
        </Link>

      </div>

    </PageLayout>
  )
}
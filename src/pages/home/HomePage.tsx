import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HotelCard } from "../../components/common/HotelCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { listHotels } from "../../services/hotels";
import type { Hotel } from "../../types/api";

export function HomePage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState({ q: "", checkIn: "", checkOut: "", guests: "2" });

  useEffect(() => {
    listHotels({ sort: "rating_desc", page: 1 }).then((res) => setHotels(res.data.slice(0, 6))).catch(() => setHotels([]));
  }, []);

  function submit() {
    const params = new URLSearchParams();
    if (form.q) params.set("q", form.q);
    if (form.guests) params.set("capacity", form.guests);
    if (form.checkIn) params.set("checkIn", form.checkIn);
    if (form.checkOut) params.set("checkOut", form.checkOut);
    navigate(`/hotels?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-xl border border-border bg-white p-5 md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">Find the right stay for your next trip</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Search approved hotels, choose a room, book dates, and complete mock payment in one flow.</p>
          </div>
          <Card className="grid gap-3 p-3 md:grid-cols-[1.2fr_1fr_1fr_0.7fr_auto]">
            <Input placeholder="Location or hotel" value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} />
            <Input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
            <Input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
            <Input type="number" min={1} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} />
            <Button onClick={submit}><Search className="mr-2 h-4 w-4" />Search</Button>
          </Card>
        </div>
        <div className="min-h-64 overflow-hidden rounded-lg bg-slate-100">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop" alt="Hotel lobby" />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured hotels</h2>
          <Button variant="secondary" onClick={() => navigate("/hotels")}>View all</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">{hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div>
      </section>
    </div>
  );
}

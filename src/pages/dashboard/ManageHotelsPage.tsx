import { Building2, Edit2, ImagePlus, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorState } from "../../components/common/ErrorState";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { createHotel, myHotels, updateHotel } from "../../services/hotels";
import type { Hotel } from "../../types/api";
import toast from "react-hot-toast";

const empty = {
  name: "",
  address: "",
  description: "",
  latitude: "10.762622",
  longitude: "106.660172",
  images: [] as string[],
};

export function ManageHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setHotels(await myHotels());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function submit() {
    setError("");
    try {
      if (editing) await updateHotel(editing, form);
      else await createHotel(form);
      toast.success(
        editing
          ? "Cập nhật khách sạn thành công!"
          : "Tạo khách sạn thành công!",
      );
      setForm(empty);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }),
    ).then((base64Images) => {
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images],
      }));
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Khách sạn</h1>
        <p className="text-slate-500 mt-2">
          Thêm mới và cập nhật thông tin các cơ sở lưu trú của bạn.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr] items-start">
        {/* Form bên trái */}
        <div className="lg:sticky lg:top-24 z-10">
          <Card className="h-fit space-y-5 p-8 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              {editing ? "Chỉnh sửa khách sạn" : "Thêm khách sạn mới"}
            </h2>
            {error && <ErrorState message={error} />}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Tên khách sạn
                </label>
                <Input
                  className="rounded-xl bg-slate-50 focus:bg-white"
                  placeholder="Vd: Mường Thanh Luxury..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Địa chỉ
                </label>
                <Input
                  className="rounded-xl bg-slate-50 focus:bg-white"
                  placeholder="Vd: 123 Đường ABC..."
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Mô tả
                </label>
                <Input
                  className="rounded-xl bg-slate-50 focus:bg-white"
                  placeholder="Vd: Khách sạn 5 sao với view biển..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Vĩ độ (Lat)
                  </label>
                  <Input
                    className="rounded-xl bg-slate-50 focus:bg-white"
                    placeholder="10.762622"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm({ ...form, latitude: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Kinh độ (Lng)
                  </label>
                  <Input
                    className="rounded-xl bg-slate-50 focus:bg-white"
                    placeholder="106.660172"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm({ ...form, longitude: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                  <ImagePlus className="w-4 h-4" /> Ảnh khách sạn
                </label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="rounded-xl pt-1.5"
                />
                {form.images && form.images.length > 0 && (
                  <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative shrink-0 group">
                        <img
                          src={img}
                          alt="preview"
                          className="h-20 w-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md opacity-0 group-hover:opacity-100"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="w-full py-3 rounded-xl mt-4 shadow-sm"
                onClick={submit}
              >
                {editing ? "Cập nhật khách sạn" : "Tạo khách sạn"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Danh sách bên phải */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Danh sách khách sạn của bạn ({hotels.length})
          </h2>
          {hotels.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-500">
              Bạn chưa có khách sạn nào. Hãy tạo khách sạn đầu tiên nhé!
            </div>
          ) : (
            hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all"
              >
                <img
                  src={
                    hotel.images?.[0] ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  }
                  alt={hotel.name}
                  className="w-full sm:w-40 h-32 object-cover rounded-2xl border border-slate-100 shrink-0"
                />
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">
                        {hotel.name}
                      </h3>
                      <div className="text-sm text-slate-500 mt-1.5 flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="w-4 h-4 shrink-0" /> {hotel.address}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 text-xs rounded-full font-bold ${hotel.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : hotel.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {hotel.status === "APPROVED"
                        ? "Đã duyệt"
                        : hotel.status === "REJECTED"
                          ? "Bị từ chối"
                          : "Chờ duyệt"}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="secondary"
                      className="rounded-xl px-6"
                      onClick={() => {
                        setEditing(hotel.id);
                        setForm({
                          name: hotel.name,
                          address: hotel.address,
                          description: hotel.description || "",
                          latitude: String(hotel.latitude),
                          longitude: String(hotel.longitude),
                          images: hotel.images || [],
                        });
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { BedDouble, Building2, Edit2, ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { myHotels, listHotelRooms } from "../../services/hotels";
import { createRoom, deleteRoom, updateRoom } from "../../services/rooms";
import type { Hotel, Room } from "../../types/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { formatMoney } from "../../utils/money";
import toast from "react-hot-toast";

const COMMON_AMENITIES = [
  "Wifi miễn phí",
  "TV màn hình phẳng",
  "Điều hòa nhiệt độ",
  "Ban công",
  "Bồn tắm",
  "Tủ lạnh mini",
  "Máy sấy tóc",
  "Bếp mini",
  "View biển",
  "View thành phố",
  "Bàn làm việc",
  "Cách âm",
];

export function ManageRoomsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const selectedAmenities = watch("amenities") || [];

  useEffect(() => {
    myHotels().then(setHotels).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      listHotelRooms(selectedHotelId).then(setRooms).catch(console.error);
    } else {
      setRooms([]);
    }
    setEditingRoomId(null);
    reset({ name: "", price: "", capacity: "", amenities: [] });
    setRoomImages([]);
  }, [selectedHotelId, reset]);

  const onSubmit = async (data: any) => {
    if (!selectedHotelId) return toast.error("Vui lòng chọn khách sạn trước!");
    setLoading(true);
    try {
      const payload = {
        hotelId: selectedHotelId,
        name: data.name,
        price: Number(data.price),
        capacity: Number(data.capacity),
        amenities: Array.isArray(data.amenities)
          ? data.amenities
          : data.amenities
            ? [data.amenities]
            : [],
        images: roomImages,
      };

      if (editingRoomId) {
        await updateRoom(editingRoomId, payload);
        toast.success("Cập nhật phòng thành công!");
      } else {
        await createRoom(payload);
        toast.success("Thêm phòng thành công!");
      }

      reset({ name: "", price: "", capacity: "", amenities: [] });
      setRoomImages([]);
      setEditingRoomId(null);

      const updatedRooms = await listHotelRooms(selectedHotelId);
      setRooms(updatedRooms);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi xử lý");
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    const current = Array.isArray(selectedAmenities) ? selectedAmenities : [];
    if (current.includes(amenity)) {
      setValue(
        "amenities",
        current.filter((a) => a !== amenity),
      );
    } else {
      setValue("amenities", [...current, amenity]);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((r) => r.id !== roomId)); 
      toast.success("Xóa phòng thành công!");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa phòng");
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoomId(room.id);
    setValue("name", room.name);
    setValue("price", room.price);
    setValue("capacity", room.capacity);
    setValue("amenities", room.amenities);
    setRoomImages(room.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingRoomId(null);
    reset({ name: "", price: "", capacity: "", amenities: [] });
    setRoomImages([]);
  };

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
      setRoomImages((prev) => [...prev, ...base64Images]);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Phòng</h1>
        <p className="text-slate-500">
          Thêm và xóa các phòng thuộc khách sạn của bạn.
        </p>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-24 z-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit max-h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className={selectedHotelId ? "mb-8" : ""}>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                1. Chọn khách sạn
              </label>
              <Select
                className="rounded-xl"
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
              >
                <option value="">-- Vui lòng chọn khách sạn --</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            </div>

            {selectedHotelId && (
              <div className="pt-8 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-primary" />
                  2. {editingRoomId ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
                </label>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Tên phòng
                    </label>
                    <Input
                      className="rounded-xl"
                      {...register("name", { required: true })}
                      placeholder="Vd: Phòng Standard..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">
                        Giá / Đêm ($)
                      </label>
                      <Input
                        className="rounded-xl"
                        type="number"
                        {...register("price", { required: true })}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">
                        Sức chứa
                      </label>
                      <Input
                        className="rounded-xl"
                        type="number"
                        {...register("capacity", { required: true })}
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Tiện ích
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_AMENITIES.map((a) => {
                        const isSelected =
                          Array.isArray(selectedAmenities) &&
                          selectedAmenities.includes(a);
                        return (
                          <button
                            type="button"
                            key={a}
                            onClick={() => toggleAmenity(a)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors border ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {a}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <ImagePlus className="w-4 h-4" /> Ảnh phòng
                    </label>
                    <Input
                      className="rounded-xl pt-1.5"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {roomImages.length > 0 && (
                      <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                        {roomImages.map((img, idx) => (
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
                                setRoomImages((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-2">
                    {editingRoomId && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 py-3 rounded-xl"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        Hủy
                      </Button>
                    )}
                    <Button
                      className="flex-1 py-3 rounded-xl"
                      disabled={loading}
                    >
                      {loading
                        ? "Đang xử lý..."
                        : editingRoomId
                          ? "Cập nhật phòng"
                          : "Thêm phòng"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedHotelId ? (
            <>
              <h2 className="font-bold text-2xl text-slate-900">
                Danh sách phòng ({rooms.length})
              </h2>
              {rooms.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-500">
                  Chưa có phòng nào. Hãy thêm phòng đầu tiên ở cột bên trái!
                </div>
              ) : (
                <div className="grid xl:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden"
                    >
                      {room.images && room.images.length > 0 && (
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-40 object-cover rounded-2xl mb-4 border border-slate-100"
                        />
                      )}
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-slate-900 line-clamp-1">
                          {room.name}
                        </h3>
                        <div className="text-sm text-slate-500 mt-3 space-y-2 flex-1">
                          <p className="flex justify-between">
                            <span>💰 Giá / Đêm:</span>
                            <span className="font-bold text-primary text-base">
                              {formatMoney(Number(room.price))}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span>👥 Sức chứa:</span>{" "}
                            <span className="font-medium text-slate-700">
                              {room.capacity} người
                            </span>
                          </p>
                          <p className="line-clamp-1">
                            ✨ {room.amenities.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl text-slate-700"
                          onClick={() => handleEdit(room)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
                          onClick={() => handleDelete(room.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Xóa phòng
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
              <Building2 className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-xl font-bold text-slate-700">
                Vui lòng chọn khách sạn
              </p>
              <p className="text-sm mt-2 max-w-sm">
                Bạn cần chọn một khách sạn ở danh sách bên trái để có thể xem và
                quản lý các phòng tương ứng.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

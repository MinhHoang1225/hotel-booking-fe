import React from "react";
import { Users, CheckCircle2, Info } from "lucide-react";
import { Button } from "../ui/Button";
import { formatMoney } from "../../utils/money";

export interface Room {
  id: string;
  name: string;
  images: string[];
  price: number;
  capacity: number;
  amenities: string[];
  description?: string;
  totalPrice?: number;
}

interface RoomMatrixProps {
  rooms: Room[];
  nights: number;
  onBook: (roomId: string) => void;
}

export function RoomMatrix({ rooms, nights, onBook }: RoomMatrixProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500">
        Không có phòng trống phù hợp.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-primary/5 border-b border-slate-200 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <th className="p-4 w-[40%]">Thông tin phòng</th>
            <th className="p-4 text-center w-[10%]">Khách</th>
            <th className="p-4 text-right w-[25%]">Giá {nights} đêm</th>
            <th className="p-4 text-center w-[25%]">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="p-5 align-top border-r border-slate-200 bg-white">
                <p className="font-bold text-lg text-slate-900 hover:text-primary cursor-pointer mb-3">
                  {room.name}
                </p>
                <div className="flex gap-4">
                  {room.images?.[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-32 h-24 object-cover rounded-xl border border-slate-100"
                    />
                  )}
                  <div className="text-sm text-slate-600 flex-1">
                    {room.description && (
                      <p className="text-slate-500 line-clamp-2 italic mb-2">
                        "{room.description}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.amenities?.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />{" "}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </td>

              <td className="p-5 align-middle text-center border-r border-slate-200 bg-white">
                <div className="flex flex-wrap justify-center items-center gap-0.5">
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <Users key={i} className="w-5 h-5 text-slate-700" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Tối đa {room.capacity} khách
                </p>
              </td>

              <td className="p-5 align-middle text-right border-r border-slate-200">
                <p className="text-2xl font-bold text-slate-900">
                  {formatMoney(room.totalPrice || room.price * nights)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Đã bao gồm thuế và phí
                </p>
              </td>

              <td className="p-5 align-middle text-center">
                <Button
                  onClick={() => onBook(room.id)}
                  className="w-full rounded-xl py-2.5 font-bold shadow-md hover:shadow-lg"
                >
                  Đặt ngay
                </Button>
                <p className="text-xs text-emerald-600 font-medium mt-2 flex justify-center items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Giữ chỗ nhanh chóng
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

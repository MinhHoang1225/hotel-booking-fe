import { ArrowLeft, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { listUsers, updateUserRole, deleteUser } from "../../services/users";
import toast from "react-hot-toast";

export function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm("Bạn có chắc chắn muốn thay đổi quyền của người dùng này?"))
      return;
    try {
      await updateUserRole(userId, newRole);
      toast.success("Cập nhật quyền thành công!");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật quyền");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Hành động này không thể hoàn tác! Bạn có chắc chắn muốn xóa người dùng này?",
      )
    )
      return;
    try {
      await deleteUser(userId);
      toast.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa người dùng");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại
        </button>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Quản lý Người dùng
        </h1>
        <p className="text-slate-500 mt-2">
          Xem và quản lý danh sách tài khoản, phân quyền trong hệ thống.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <Card className="rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-bold whitespace-nowrap">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 font-bold text-right whitespace-nowrap">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-slate-900">
                          {user.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === "ADMIN" ? "bg-red-100 text-red-700" : user.role === "HOTEL_OWNER" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}
                      >
                        {user.role === "ADMIN"
                          ? "Quản trị viên"
                          : user.role === "HOTEL_OWNER"
                            ? "Chủ khách sạn"
                            : "Khách hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap flex items-center justify-end gap-3">
                      {/* <div className="w-40">
                        <Select
                          className="w-full text-sm rounded-xl"
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                        >
                          <option value="USER">Khách hàng</option>
                          <option value="HOTEL_OWNER">Chủ khách sạn</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </Select>
                      </div> */}
                      <Button
                        variant="ghost"
                        className="text-red-600 bg-red-50 hover:bg-red-100 px-3 rounded-xl"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

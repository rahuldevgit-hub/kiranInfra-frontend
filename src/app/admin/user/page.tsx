"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from '@/components/ui/loader'
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllUsers,
  deleteUser,
  updateStatusUser,
} from "@/services/userService";
import PaginatedDataTable from "@/components/PaginatedDataTablet";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile?: number;
  office?: number;
  status?: string;
  role?: string;
  image?: string;
  fburl?: string;
  twitterurl?: string;
  linkedinurl?: string;
  googleplusurl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const UserListPage = () => {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers(page, limit);
      const result = res?.result;
      const data: User[] = Array.isArray(result?.data) ? result.data : [];
      setFilteredData(data);
      setTotalRows(result?.total || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ call inside useEffect
  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to delete user.", "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_: User, index: number) =>
          ((page - 1) * limit + index + 1).toString(),
      },
      { name: "Name", selector: (row: User) => row.name || "N/A" },
      { name: "Email", selector: (row: User) => row.email || "N/A" },
      {
        name: "Mobile",
        selector: (row: User) => (row.mobile ? String(row.mobile) : "N/A"),
      },
      {
        name: "Office",
        selector: (row: User) => (row.office ? String(row.office) : "N/A"),
      },
      { name: "Facebook", selector: (row: User) => row.fburl || "N/A" },
      { name: "Twitter", selector: (row: User) => row.twitterurl || "N/A" },
      { name: "LinkedIn", selector: (row: User) => row.linkedinurl || "N/A" },
      {
        name: "Google Plus",
        selector: (row: User) => row.googleplusurl || "N/A",
      },
      {
        name: "Actions",
        cell: (row: User) => (
          <div className="flex space-x-3 items-center">
            <div
              className="cursor-pointer"
              title={`Click to mark as ${row.status === "Y" ? "InActive" : "Active"
                }`}
              onClick={async () => {
                const result = await Swal.fire({
                  title: "Are you sure",
                  text: `You want to change status to ${row.status === "Y" ? "inactive" : "active"
                    }?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes, change it!",
                });
                if (result.isConfirmed) {
                  updateStatus(row.id, row.status === "Y" ? "N" : "Y");
                }
              }}
            >
              {row.status === "Y" ? (
                <ToggleRight size={20} className="text-green-500" />
              ) : (
                <ToggleLeft size={20} className="text-red-500" />
              )}
            </div>

            <button
              title="Edit"
              onClick={() => router.push(`/admin/user/edit?id=${row.id}`)}
            >
              <Edit size={18} color="green" />
            </button>
            <button title="Delete" onClick={() => handleDelete(row.id)}>
              <Trash2 size={16} color="red" />
            </button>
          </div>
        ),
      },
    ],
    [page, limit]
  );

  // Add updateStatus handler
  const updateStatus = async (id: number, status: string) => {
    try {
      await updateStatusUser(id.toString(), { status });
      Swal.fire("Updated!", "User status has been updated.", "success");
      fetchData();
    } catch (error) {
      Swal.fire("Error", "Failed to update status.", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12 justify-between">
            <h1 className="text-xl font-medium text-gray-800">User List</h1>
            <button
              title="Add faq"
              onClick={() => router.push("/admin/user/add")}
              className="p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (<Loader />) : (
          <PaginatedDataTable
            columns={columns}
            data={filteredData}
            page={page}
            totalCount={totalRows}
            itemsPerPage={limit}
            onPageChange={setPage}
            onPerPageChange={setLimit}
          />
        )}
      </main>
    </div>
  );
};

export default UserListPage;

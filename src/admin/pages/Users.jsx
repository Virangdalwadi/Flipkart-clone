import { useEffect, useState } from "react";
import {
  getAdminUserById,
  getAdminUsers,
  updateAdminUserStatus,
} from "../../api/Userapi";

const PAGE_SIZE = 10;
const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function requestError(error) {
  if (error.response?.status === 401) {
    return "Your session has expired. Sign in again to continue.";
  }
  if (error.response?.status === 403) {
    return "Your account does not have administrator access.";
  }
  return (
    error.response?.data?.message ||
    error.message ||
    "The request failed. Please try again."
  );
}

function fullName(user) {
  return [user.username, user.lastName].filter(Boolean).join(" ") || "Unnamed user";
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-700"
        }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function UserDetailsDialog({ user, loading, error, onClose }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="user-details-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="user-details-title" className="text-xl font-bold text-gray-900">
              User details
            </h2>
            {!loading && user && (
              <p className="mt-1 break-all text-sm text-gray-500">{user.email}</p>
            )}
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-3" aria-label="Loading user details">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="h-10 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : user ? (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{fullName(user)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Email</dt>
              <dd className="mt-1 break-all text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Role</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Status</dt>
              <dd className="mt-1"><StatusBadge isActive={user.isActive} /></dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Mobile</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.mobile || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">{user.gender || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Joined</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </dd>
            </div>
          </dl>
        ) : null}
      </section>
    </div>
  );
}

function StatusConfirmation({ user, saving, error, onCancel, onConfirm }) {
  if (!user) return null;
  const nextActive = !user.isActive;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onCancel();
      }}
    >
      <section
        aria-labelledby="user-status-title"
        aria-modal="true"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
      >
        <h2 id="user-status-title" className="text-lg font-bold text-gray-900">
          {nextActive ? "Activate account?" : "Deactivate account?"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {nextActive
            ? `Allow ${fullName(user)} to sign in and use the account again?`
            : `Deactivate ${fullName(user)}? They will be signed out and will not be able to sign in until the account is reactivated.`}
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border cursor-pointer border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={`rounded-lg px-4 py-2 text-sm cursor-pointer font-semibold text-white disabled:opacity-60 ${nextActive ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-400"
              }`}
          >
            {saving ? "Saving..." : nextActive ? "Activate account" : "Deactivate account"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [details, setDetails] = useState({ user: null, loading: false, error: "" });
  const [pendingUser, setPendingUser] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getAdminUsers(
          {
            page,
            limit: PAGE_SIZE,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(role ? { role } : {}),
            ...(status ? { status } : {}),
          },
          { signal: controller.signal },
        );
        if (page > Math.max(result.totalPages, 1)) {
          setPage(Math.max(result.totalPages, 1));
        }
        setUsers(result.users);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(requestError(error));
          setUsers([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [page, debouncedSearch, role, status, reload]);

  useEffect(() => {
    if (!selectedUserId) return undefined;
    const controller = new AbortController();
    setDetails({ user: null, loading: true, error: "" });

    getAdminUserById(selectedUserId, { signal: controller.signal })
      .then((user) => setDetails({ user, loading: false, error: "" }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setDetails({
            user: null,
            loading: false,
            error: requestError(error),
          });
        }
      });

    return () => controller.abort();
  }, [selectedUserId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = search.trim();
      setDebouncedSearch((current) => {
        if (current !== next) {
          setPage(1);
          setNotice("");
        }
        return next;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const confirmStatusChange = async () => {
    if (!pendingUser) return;
    setStatusSaving(true);
    setStatusError("");
    try {
      await updateAdminUserStatus(pendingUser.id, !pendingUser.isActive);
      setNotice(
        `${fullName(pendingUser)}'s account is now ${pendingUser.isActive ? "inactive" : "active"
        }.`,
      );
      setPendingUser(null);
      setReload((value) => value + 1);
    } catch (statusRequestError) {
      setStatusError(requestError(statusRequestError));
    } finally {
      setStatusSaving(false);
    }
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
    setNotice("");
  };

  const firstResult = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastResult = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search customer accounts, review their details, and manage account access.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(16rem,1fr)_10rem_10rem]">
        <label className="text-sm font-medium text-gray-700">
          Search users
          <input
            aria-label="Search users"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or email"
            className={`${fieldClass} mt-1`}
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Role
          <select
            aria-label="Filter by role"
            value={role}
            onChange={(event) => handleFilterChange(setRole, event.target.value)}
            className={`${fieldClass} mt-1`}
          >
            <option value="">All roles</option>
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Status
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => handleFilterChange(setStatus, event.target.value)}
            className={`${fieldClass} mt-1`}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      {notice && (
        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          {notice}
        </p>
      )}
      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setReload((value) => value + 1)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
          <h2 className="font-semibold text-gray-900">Users</h2>
          {!loading && !error && (
            <p className="text-sm text-gray-500">
              Showing {firstResult}–{lastResult} of {total}
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-190 w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th scope="col" className="px-4 py-3">User</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Joined</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }, (_, index) => (
                  <tr key={index} aria-label="Loading users">
                    <td colSpan="5" className="px-4 py-3">
                      <div className="h-8 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center text-sm text-gray-500">
                    Users could not be loaded.
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{fullName(user)}</p>
                      <p className="mt-0.5 text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700">
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "seller"
                          ? "Seller"
                          : "Customer"}
                    </td>
                    <td className="px-4 py-3"><StatusBadge isActive={user.isActive} /></td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedUserId(user.id)}
                          className="font-semibold text-blue-700 cursor-pointer"
                        >
                          View
                        </button>
                        {user.role === "admin" ? (
                          <span className="text-xs text-gray-400" title="Administrator accounts are protected">
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setStatusError("");
                              setPendingUser(user);
                            }}
                            className={`font-semibold cursor-pointer ${user.isActive ? "text-red-600" : "text-green-700"
                              }`}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <p className="font-semibold text-gray-800">No users found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">Page {page} of {Math.max(totalPages, 1)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={loading || page >= totalPages || totalPages === 0}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedUserId && (
        <UserDetailsDialog
          user={details.user}
          loading={details.loading}
          error={details.error}
          onClose={() => setSelectedUserId(null)}
        />
      )}
      <StatusConfirmation
        user={pendingUser}
        saving={statusSaving}
        error={statusError}
        onCancel={() => {
          if (!statusSaving) setPendingUser(null);
        }}
        onConfirm={confirmStatusChange}
      />
    </section>
  );
}

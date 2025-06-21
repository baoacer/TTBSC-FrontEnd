<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col p-0 shadow-lg"
    >
      <div class="flex items-center gap-2 px-6 py-6 border-b border-blue-800">
        <svg
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 7V6a3 3 0 013-3h12a3 3 0 013 3v1M3 7v11a3 3 0 003 3h12a3 3 0 003-3V7M3 7h18"
          />
        </svg>
        <span class="text-2xl font-bold tracking-wide">Admin Panel</span>
      </div>
      <nav class="flex-1 py-6 space-y-1">
        <router-link
          to="/admin/products"
          class="flex items-center gap-3 py-2 px-6 rounded-lg hover:bg-blue-800 transition"
          active-class="bg-blue-700 font-semibold shadow"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
            />
          </svg>
          <span>Quản lý sản phẩm</span>
        </router-link>
        <router-link
          to="/admin/users"
          class="flex items-center gap-3 py-2 px-6 rounded-lg hover:bg-blue-800 transition"
          active-class="bg-blue-700 font-semibold shadow"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 11-8 0 4 4 0 018 0zm6 2a4 4 0 00-3-3.87"
            />
          </svg>
          <span>Quản lý người dùng</span>
        </router-link>
        <router-link
          to="/admin/orders"
          class="flex items-center gap-3 py-2 px-6 rounded-lg hover:bg-blue-800 transition"
          active-class="bg-blue-700 font-semibold shadow"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-5a2 2 0 00-2-2h-6a2 2 0 00-2 2v5a2 2 0 002 2z"
            />
          </svg>
          <span>Quản lý đơn hàng</span>
        </router-link>
        <router-link
          to="/admin/categories"
          class="flex items-center gap-3 py-2 px-6 rounded-lg hover:bg-blue-800 transition"
          active-class="bg-blue-700 font-semibold shadow"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
          </svg>
          <span>Quản lý danh mục</span>
        </router-link>
      </nav>
      <div
        class="mt-auto px-6 py-4 border-t border-blue-800 text-sm text-blue-200"
      >
        &copy; {{ new Date().getFullYear() }} TTBSC Admin
      </div>
    </aside>
    <!-- Main content -->
    <main class="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
      <router-view />
    </main>
  </div>
</template>

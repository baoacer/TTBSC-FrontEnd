
<template>
  <div class="flex min-h-screen bg-gray-100">
    <aside class="w-64 bg-blue-900 text-white p-6">
      <h1 class="text-2xl font-bold mb-6">Admin</h1>
      <nav class="space-y-2">
        <router-link to="/admin/products"  class="block py-2 px-4 rounded hover:bg-blue-800"
        active-class="bg-blue-700">
          <span class="ml-2">Quản lý sản phẩm</span>
        </router-link>
        <router-link to="/admin/adds"  class="block py-2 px-4 rounded hover:bg-blue-800"
        active-class="bg-blue-700">
          <span class="ml-2">Thêm sản phẩm</span>
        </router-link>

        <router-link to="/admin/edit-product"  class="block py-2 px-4 rounded hover:bg-blue-800"
        active-class="bg-blue-700">
          <span class="ml-2">Sửa sản phẩm</span>
        </router-link>
        <router-link to="/admin/users"  class="block py-2 px-4 rounded hover:bg-blue-800"
        active-class="bg-blue-700">
          <span class="ml-2">Quản lý người dùng</span>
        </router-link>
        <router-link to="/admin/orders"  class="block py-2 px-4 rounded hover:bg-blue-800"
        active-class="bg-blue-700">
          <span class="ml-2">Quản lý đơn hàng</span>
        </router-link>
      </nav>
    </aside>
    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>

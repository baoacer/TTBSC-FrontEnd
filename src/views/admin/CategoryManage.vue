<template>
  <div class="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">Quản lý danh mục</h2>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2"
        @click="showAddModal = true"
      >
        <span class="material-icons">add</span>
        Thêm danh mục
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border text-sm">
        <thead>
          <tr class="bg-gray-100 text-center">
            <th class="border px-2 py-2">Tên danh mục</th>
            <th class="border px-2 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categories"
            :key="category._id"
            class="hover:bg-gray-50 text-center"
          >
            <td class="border px-2 py-2 font-semibold">{{ category.name }}</td>
            <td class="border px-2 py-2">
              <button
                class="text-blue-600 hover:text-blue-800 mr-2"
                @click="editCategory(category)"
              >
                <span class="material-icons align-middle">edit_note</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm danh mục -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          @click="showAddModal = false"
          aria-label="Đóng"
        >
          &times;
        </button>
        <h3 class="text-lg font-bold mb-4">Thêm danh mục</h3>
        <form @submit.prevent="addCategory">
          <input
            v-model="newCategoryName"
            class="border rounded w-full p-2 mb-4"
            placeholder="Tên danh mục"
            required
          />
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
            :disabled="loading"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>

    <!-- Modal sửa danh mục -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          @click="showEditModal = false"
          aria-label="Đóng"
        >
          &times;
        </button>
        <h3 class="text-lg font-bold mb-4">Sửa danh mục</h3>
        <form @submit.prevent="updateCategory">
          <input
            v-model="editCategoryName"
            class="border rounded w-full p-2 mb-4"
            placeholder="Tên danh mục"
            required
          />
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
            :disabled="loading"
          >
            Lưu
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCategory } from "../../composables/useCategory";
import { toast } from "vue3-toastify";

const { categories, fetchCategories, addCategory: apiAddCategory, updateCategory: apiUpdateCategory } = useCategory();

const showAddModal = ref(false);
const showEditModal = ref(false);
const newCategoryName = ref("");
const editCategoryName = ref("");
const editingCategoryId = ref(null);
const loading = ref(false);

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  loading.value = true;
  try {
    await apiAddCategory({ name: newCategoryName.value.trim() });
    toast.success("Thêm danh mục thành công!");
    showAddModal.value = false;
    newCategoryName.value = "";
    await fetchCategories();
  } catch (e) {
    toast.error("Thêm danh mục thất bại!");
  } finally {
    loading.value = false;
  }
};

const editCategory = (category) => {
  editingCategoryId.value = category._id;
  editCategoryName.value = category.name;
  showEditModal.value = true;
};

const updateCategory = async () => {
  if (!editCategoryName.value.trim()) return;
  loading.value = true;
  try {
    await apiUpdateCategory(editingCategoryId.value, { name: editCategoryName.value.trim() });
    toast.success("Cập nhật danh mục thành công!");
    showEditModal.value = false;
    editCategoryName.value = "";
    editingCategoryId.value = null;
    await fetchCategories();
  } catch (e) {
    toast.error("Cập nhật danh mục thất bại!");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
.material-icons {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
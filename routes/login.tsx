export function UserLogin() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <div class="isolate -space-y-px rounded-md shadow-sm">
        <div class="relative rounded-md rounded-b-none border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          <label for="name" class="block text-xs font-medium text-gray-900">
            Username/Email
          </label>
          <input
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="maria.gonzalez@example.com"
          />
        </div>
        <div class="relative rounded-md rounded-t-none border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          <label for="password" class="block text-xs font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="passord"
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
export default UserLogin;

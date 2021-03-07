<template>
  <div class="d-flex flex-column h-100">
    <user-control> </user-control>
    <div class="overflow-auto h-100">
      <user-table></user-table>
    </div>
  </div>
</template>

<script>
import UserTable from '../../components/user/UserTable'
import UserControl from '../../components/user/UserControl'
export default {
  name: 'UserManage',
  components: { UserControl, UserTable },
}
</script>

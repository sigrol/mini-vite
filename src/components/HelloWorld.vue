<template>
  <h1 class="title" style="color: red">{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p class="content">Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
<style>
.title{
  background: #8B4513
}
</style>

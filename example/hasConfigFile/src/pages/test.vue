<template>
	<div>helloworld</div>
</template>
<script>
	export default {
    created:function(){
      console.log(this.$root.config['APP_NAME'])
    }
	}
</script>

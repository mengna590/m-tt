<template>
  <div class="container">
    <div class="page-login">
      <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
      <van-cell-group>
        <van-field label="手机号" placeholder="请输入手机号" />
        <van-field label="验证码" placeholder="请输入验证码">
          <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
        </van-field>
      </van-cell-group>
      <div class="btn_box">
        <van-button type="info" @click="login" block round>登 录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'></style>

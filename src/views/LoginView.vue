<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const account = ref('admin')
const password = ref('123456')
const remember = ref(true)
const tab = ref<'account' | 'code'>('account')

function login() {
  if (tab.value === 'account' && (!account.value || !password.value)) return ElMessage.warning('请输入账号和密码')
  ElMessage.success('登录成功')
  router.push('/workspace')
}
</script>

<template>
  <div class="login-page">
    <section class="login-shell">
      <div class="login-panel">
        <div class="brand"><span><i class="i-tabler-sparkles" /></span><div><strong>H5 营销编辑器</strong><small>快速搭建营销页面</small></div></div>
        <div class="welcome"><h1>欢迎回来</h1><p>登录后继续创建和管理你的 H5 营销项目。</p></div>

        <div class="tabs"><button :class="{ active: tab === 'account' }" @click="tab = 'account'">账号登录</button><button :class="{ active: tab === 'code' }" @click="tab = 'code'">验证码登录</button></div>

        <div v-if="tab === 'account'" class="form">
          <label>账号</label><div class="input"><i class="i-tabler-user" /><input v-model="account" placeholder="请输入手机号 / 邮箱" /></div>
          <label>密码</label><div class="input"><i class="i-tabler-lock" /><input v-model="password" type="password" placeholder="请输入密码" /></div>
        </div>
        <div v-else class="form">
          <label>手机号</label><div class="input"><i class="i-tabler-device-mobile" /><input placeholder="请输入手机号" /></div>
          <label>验证码</label><div class="input code"><i class="i-tabler-shield-check" /><input placeholder="请输入验证码" /><button>获取验证码</button></div>
        </div>

        <div class="assist"><label><input v-model="remember" type="checkbox" /> 记住我</label><button>忘记密码？</button></div>
        <button class="login-btn" @click="login">登录</button>
        <div class="divider"><span>或</span></div>
        <div class="social"><button><i class="i-tabler-brand-wechat" /><span>微信登录</span></button><button><i class="i-tabler-message-circle" /><span>验证码登录</span></button></div>
        <p class="signup">还没有账号？ <button>立即注册</button></p>
      </div>

      <div class="visual-panel">
        <div class="visual-copy"><span>拖拽创意 · 快速发布</span><h2>让每一个营销创意都更简单</h2><p>海量模板、丰富组件、可视化编辑，从搭建到发布一步完成。</p></div>
        <div class="showcase">
          <div class="showcase-card card-a"><div class="mini-head" /><div class="mini-hero">夏日焕新</div><div class="mini-cards"><i /><i /><i /></div></div>
          <div class="showcase-card card-b"><div class="mini-head" /><div class="mini-hero pink">品牌周年庆</div><div class="mini-form"><i /><i /><button>立即参与</button></div></div>
          <div class="showcase-card card-c"><div class="mini-head" /><div class="mini-hero dark">新品发布</div><div class="mini-products"><i /><i /></div></div>
        </div>
        <span class="annotation">让设计更简单 <i class="i-tabler-arrow-back-up" /></span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-page{min-height:100%;padding:36px;display:grid;place-items:center;background:linear-gradient(135deg,#f7faff 0%,#eef5ff 48%,#f5f7ff 100%);overflow:auto}.login-shell{width:min(1120px,100%);min-height:650px;display:grid;grid-template-columns:430px 1fr;background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:22px;box-shadow:0 28px 70px rgba(45,72,112,.12);overflow:hidden}.login-panel{padding:38px 42px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:10px}.brand>span{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,var(--brand-700),var(--brand-400));color:#fff;display:grid;place-items:center;font-size:20px;box-shadow:var(--shadow-brand)}.brand div{display:flex;flex-direction:column}.brand strong{font-size:17px;color:var(--text-strong)}.brand small{font-size:9px;color:var(--text-muted);letter-spacing:1.2px;margin-top:3px}.welcome{margin-top:42px}.welcome h1{font-size:27px;margin:0 0 8px;color:var(--text-strong)}.welcome p{margin:0;color:var(--text-muted);font-size:12px;line-height:1.7}.tabs{display:grid;grid-template-columns:1fr 1fr;margin-top:28px;border-bottom:1px solid var(--border-subtle)}.tabs button{height:42px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--text-secondary);cursor:pointer}.tabs button.active{color:var(--brand-600);border-bottom-color:var(--brand-600);font-weight:600}.form{display:flex;flex-direction:column;gap:8px;margin-top:18px}.form label{font-size:11px;color:var(--text-secondary);font-weight:600}.input{height:40px;border:1px solid var(--border-default);border-radius:var(--radius-md);display:flex;align-items:center;padding:0 11px;color:var(--text-muted);transition:all var(--motion-base) var(--ease-standard);margin-bottom:3px}.input:focus-within{border-color:var(--border-brand);box-shadow:var(--focus-ring)}.input input{border:0;outline:0;flex:1;margin-left:7px;font-size:12px;background:transparent;color:var(--text-primary)}.input.code button{border:0;background:transparent;color:var(--brand-600);font-size:10px;cursor:pointer}.assist{display:flex;justify-content:space-between;align-items:center;margin:13px 0 16px;font-size:10px;color:var(--text-secondary)}.assist label{display:flex;align-items:center;gap:5px}.assist button,.signup button{border:0;background:transparent;color:var(--brand-600);cursor:pointer}.login-btn{width:100%;height:42px;border:0;border-radius:var(--radius-md);background:var(--brand-600);color:#fff;font-weight:600;box-shadow:var(--shadow-brand);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.login-btn:hover{background:var(--brand-500)}.divider{height:36px;display:flex;align-items:center;justify-content:center;position:relative}.divider:before{content:'';position:absolute;left:0;right:0;height:1px;background:var(--border-subtle)}.divider span{position:relative;padding:0 10px;background:var(--surface-1);font-size:9px;color:var(--text-muted)}.social{display:grid;grid-template-columns:1fr 1fr;gap:10px}.social button{height:38px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);color:var(--text-secondary);display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer}.social button:hover{border-color:var(--border-brand);color:var(--brand-600);background:var(--brand-50)}.signup{text-align:center;margin:18px 0 0;font-size:10px;color:var(--text-muted)}.visual-panel{position:relative;padding:64px 60px;background:radial-gradient(circle at 82% 12%,rgba(120,171,255,.22),transparent 28%),linear-gradient(145deg,#eef6ff,#f8fbff 50%,#eaf2ff);overflow:hidden}.visual-copy{max-width:430px}.visual-copy>span{font-size:11px;color:var(--brand-600);font-weight:700}.visual-copy h2{font-size:28px;line-height:1.3;margin:8px 0 10px;color:#1c355d}.visual-copy p{font-size:12px;line-height:1.8;color:#8191a7;margin:0}.showcase{height:365px;position:relative;margin-top:30px}.showcase-card{position:absolute;width:160px;height:300px;border:6px solid #fff;border-radius:22px;background:#fff;box-shadow:0 20px 38px rgba(48,79,126,.16);overflow:hidden;padding:12px 8px}.card-a{left:28px;top:26px;transform:rotate(-7deg)}.card-b{left:190px;top:2px;z-index:2}.card-c{left:352px;top:34px;transform:rotate(7deg)}.mini-head{height:8px;width:54px;border-radius:8px;background:#e8eef7;margin:0 auto 9px}.mini-hero{height:105px;border-radius:10px;background:linear-gradient(145deg,#58c8ff,#a8ebd6 58%,#ffe29c);display:grid;place-items:center;color:#fff;font-size:18px;font-weight:800}.mini-hero.pink{background:linear-gradient(145deg,#ff91bb,#ffd9e7)}.mini-hero.dark{background:linear-gradient(145deg,#1f3555,#536a8d)}.mini-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:10px}.mini-cards i{height:46px;border-radius:7px;background:#fff0ef;border:1px solid #ffd6d3}.mini-form{margin-top:11px}.mini-form i{display:block;height:25px;border-radius:6px;background:#f2f5f9;margin-bottom:6px}.mini-form button{width:100%;height:28px;border:0;border-radius:14px;background:var(--brand-600);color:#fff;font-size:8px}.mini-products{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}.mini-products i{height:90px;border-radius:8px;background:linear-gradient(#edf7ff,#e7f1ff)}.annotation{position:absolute;right:54px;top:150px;color:var(--brand-600);font-size:12px;font-weight:600;transform:rotate(-9deg)}.annotation i{font-size:22px;margin-left:5px}@media(max-width:900px){.login-page{padding:20px}.login-shell{grid-template-columns:1fr;max-width:440px}.visual-panel{display:none}.login-panel{padding:34px}}
</style>

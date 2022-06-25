import { ElementVue } from "../types/vue-viewmodels";
import { UI } from "../vue-utils";
import Api from "@/lib/api";
import { Ref } from "@vue/composition-api";
import * as imageConversion from "image-conversion";

export default {
  /**
   * 上传照片
   */
  uploadAvatar: async (
    vue: ElementVue,
    e: Event,
    htmlInputElement: HTMLInputElement,
    avatarUrl: Ref<string>
  ) => {
    // 获取传入参数
    const user = Api.getCurrentUser();

    // 如果未登录，提示用户请先登录
    if (user === null) {
      UI.showNotification(vue.$notify, "尚未登录", "请先去登录", "warning");
      htmlInputElement.value = "";
      return;
    }

    if (e.target === null) {
      htmlInputElement.value = "";
      return;
    }
    const files = (e.target as HTMLInputElement).files;
    if (files === null) {
      htmlInputElement.value = "";
      return;
    }

    // 需要上传的头像文件
    const file = files[0];

    // 判断文件大小，如果超过 5 MB 则提示上传的头像不得超过 5 MB
    if (file.size >= 5 * 1024 * 1024) {
      UI.showNotification(
        vue.$notify,
        "上传头像失败",
        "图片大小需小于 5 MB",
        "warning"
      );
      htmlInputElement.value = "";
      return;
    }

    // 判断文件大小，如果超过了 100KB，则压缩为 100KB
    let compressionFile: Blob | null = null;
    if (file.size > 100 * 1024) {
      const loadingInstance = UI.showLoading(vue.$loading, "正在压缩图片");
      try {
        compressionFile = await imageConversion.compressAccurately(file, 100);
        UI.hideLoading(loadingInstance);
      } catch (error) {
        UI.hideLoading(loadingInstance);
        UI.showNotification(
          vue.$notify,
          "图片压缩失败",
          `错误原因：${error.message}`,
          "error"
        );
        htmlInputElement.value = "";
        return;
      }
    }

    const loadingInstance = UI.showLoading(vue.$loading, "正在上传头像");

    try {
      // 上传头像
      const newUser = await Api.uploadAvatar(
        user,
        compressionFile === null ? file : compressionFile
      );
      avatarUrl.value = newUser.attributes.avatarUrl;
      htmlInputElement.value = "";
      UI.hideLoading(loadingInstance);
      UI.showNotification(vue.$notify, "上传头像成功", "", "success");
    } catch (error) {
      htmlInputElement.value = "";
      UI.hideLoading(loadingInstance);
      UI.showNotification(
        vue.$notify,
        "上传头像失败",
        `错误原因：${error.message}`,
        "error"
      );
    }
  },
  /**
   * 获取头像 Url
   */
  fetchAvatar: async (vue: ElementVue, avatarUrl: Ref<string>) => {
    // 获取传入参数
    const user = Api.getCurrentUser();

    // 如果未登录，提示用户请先登录
    if (user === null) {
      UI.showNotification(vue.$notify, "尚未登录", "请先去登录", "warning");
      return;
    }

    await user.fetch();

    avatarUrl.value = user.attributes.avatarUrl;
  },
  /**
   * 获取用户信息，但是请求网络
   */
  fetchUserInformation: async (
    vue: ElementVue,
    nickName: Ref<string>,
    signature: Ref<string>,
    mobilePhoneNumber: Ref<string>
  ) => {
    // 获取传入参数
    const user = Api.getCurrentUser();

    // 如果未登录，提示用户请先登录
    if (user === null) {
      UI.showNotification(vue.$notify, "尚未登录", "请先去登录", "warning");
      return;
    }

    try {
      await user.fetch();
      nickName.value = user.attributes.nickName;
      signature.value = user.attributes.signature;
      mobilePhoneNumber.value = user.attributes.mobilePhoneNumber;
    } catch (error) {
      UI.showNotification(
        vue.$notify,
        "网络连接失败",
        `失败原因：${error.message}`,
        "error"
      );
    }
  },
  /**
   * 获取用户信息，但是不请求网络
   */
  getUserInformation: async (
    vue: ElementVue,
    nickName: Ref<string>,
    signature: Ref<string>,
    mobilePhoneNumber: Ref<string>
  ) => {
    // 获取传入参数
    const user = Api.getCurrentUser();

    // 如果未登录，提示用户请先登录
    if (user === null) {
      UI.showNotification(vue.$notify, "尚未登录", "请先去登录", "warning");
      return;
    }

    nickName.value = user.attributes.nickName;
    signature.value = user.attributes.signature;
    mobilePhoneNumber.value = user.attributes.mobilePhoneNumber;
  },
  /**
   * 获取头像信息，但是不请求网络
   */
  getAvatar: async (vue: ElementVue, avatarUrl: Ref<string>) => {
    // 获取传入参数
    const user = Api.getCurrentUser();

    // 如果未登录，提示用户请先登录
    if (user === null) {
      UI.showNotification(vue.$notify, "尚未登录", "请先去登录", "warning");
      return;
    }

    avatarUrl.value = user.attributes.avatarUrl;
  }
};

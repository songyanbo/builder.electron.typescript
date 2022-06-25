// Plan
import { provide, ref, reactive } from "@vue/composition-api";
import AV from "leancloud-storage";
import {
  TomatoCloudStatus,
  StatStatusMode,
  TomatoStatStatusMode,
  InputPlanType,
  InputTargetType
} from "@/lib/types/vue-viewmodels";
import { UI } from "@/lib/vue-utils";

// 临时计划列表
const temporaryPlanList = Symbol();
// 已完成计划的列表
const completedPlanList = Symbol();
// 每日计划的列表
const dailyPlanList = Symbol();
// 「目标类别」的列表
const targetSubjectList = Symbol();
// 「目标」的列表
const unSubjectiveTargetList = Symbol();
// 已完成的目标列表
const completedTargetList = Symbol();
// 番茄钟的状态
const tomatoCloudStatus = Symbol();
// 番茄中的计时器
const tomatoClockInterval = Symbol();
// 番茄钟的表盘值
const countDown = Symbol();
// 番茄开始的时间
const tomatoStartTime = Symbol();
// 控制变量：「创建目标」的抽屉菜单是否打开
const isCreateTargetDrawerDisplayed = Symbol();
// 控制变量：「编辑目标」的抽屉菜单是否打开
const isEditTargetDrawerDisplayed = Symbol();
// 用户输入：编辑「目标 Target」
const input_editingTargetOrTargetSubject = Symbol();
// 用户输入：创建「目标 Target」
const input_creatingTargetOrTargetSubject = Symbol();
// 配置信息：Vue Dragger
const draggableOptions = Symbol();
// 色彩表：常规色彩表
const colormap = Symbol();
// 色彩表：图表色彩表
const colormapForChart = Symbol();
// 色彩表：pantone 年度代表色
const colormapPantone = Symbol();
// 色彩表
const colormapForTreeChart = Symbol();
// 等级规则
const levelRuleList = Symbol();
// 能力列表
const abilityList = Symbol();
// 用户输入：编辑「能力 Ability」
const input_editingAbility = Symbol();
// 用户输入：创建「能力 Ability」
const input_creatingAbility = Symbol();
// 控制变量：「编辑能力」的抽屉菜单是否打开
const isEditAbilityDrawerDisplayed = Symbol();
// 控制变量：「创建能力」的抽屉菜单是否打开
const isCreateAbilityDrawerDisplayed = Symbol();
// 当前路由是否为主界面的四个
const isCurrentPageHome = Symbol();
// 表示番茄记录的列表状态
const tomatoStatStatusMode = Symbol();
// 表示目标记录的列表状态
const targetStatStatusMode = Symbol();
// 表示计划记录的列表状态
const planStatStatusMode = Symbol();
// 表示能力记录的列表状态
const abilityStatStatusMode = Symbol();
// 番茄列表
const tomatoList = Symbol();
// 用户选择日期范围的番茄列表
const tomatoListWithDateRange = Symbol();
// 平均线性回归表达式
const averageLinearRegressionExpression = Symbol();
// 总体线性回归表达式
const totalLinearRegressionExpression = Symbol();
// 总体线性回归表达式：Time=》for 一万小时定律
const totalLinearRegressionExpressionTime = Symbol();
// 用户选择的日期范围
const dateRange = Symbol();
// 最佳工作日：周
const bestDayInWeek = Symbol();
// 最佳工作月份
const bestMonthInYear = Symbol();
// 今年的番茄列表：为了月统计用
const thisYearTomatoList = Symbol();
// 树图的数据：用于列表展示
const treeTotalStatData = Symbol();
// 树图当前点击
const treeTotalStatDataIndex = Symbol();
// 线性图的数据：用于列表展示
const averageDailyStatData = Symbol();
// 计划 10000 小时预测数据
const tenThousandHoursPrediction = Symbol();
// 计划的月数据
const monthStatData = Symbol();
// 选择日期的提示语：如「15 日」、「30 日」、「180 日」
const dateTip = Symbol();
// 总时间
const totalTime = Symbol();
// 总整体番茄
const totalTomatoNumber = Symbol();
// 是否登录成功
const isLoginSuccess = Symbol();
// 临时变量：正在创建的计划
const input_creatingPlan = Symbol();
// 临时变量：正在编辑的计划
const input_editingPlan = Symbol();
// 临时变量：正在创建的目标
const input_creatingTarget = Symbol();
// 临时变量：正在编辑的目标
const input_editingTarget = Symbol();
// 控制变量：Target 是否打开底部菜单
const isTargetBottomMenuShow = Symbol();
// 控制变量：当前点击的 Target
const currentClickTarget = Symbol();
// 控制变量：Loading 的 Boolean
const showLoading = Symbol();
// 显示数据：Loading 的 title
const loadingTitle = Symbol();

/**
 * @TODO 像 vuex 一样，可以把在哪里调用的打印出来
 * 全局只调用一次，在 App.vue 中调用
 */
function useProvider() {
  provide(temporaryPlanList, ref<AV.Object[]>([]));
  provide(completedPlanList, ref<AV.Object[]>([]));
  provide(dailyPlanList, ref<AV.Object[]>([]));
  provide(targetSubjectList, ref<AV.Object[]>([]));
  provide(unSubjectiveTargetList, ref<AV.Object[]>([]));
  provide(completedTargetList, ref<AV.Object[]>([]));
  const preparedTomatoCloudStatus: TomatoCloudStatus = "prepared";
  provide(tomatoCloudStatus, ref<TomatoCloudStatus>(preparedTomatoCloudStatus));
  provide(tomatoClockInterval, ref<NodeJS.Timeout | null>(null));
  provide(countDown, ref<number>(1500));
  provide(tomatoStartTime, ref<Date>(Date()));
  provide(isCreateTargetDrawerDisplayed, ref<boolean>(false));
  provide(isEditTargetDrawerDisplayed, ref<boolean>(false));
  provide(
    input_editingTargetOrTargetSubject,
    reactive({
      inputType: "target", // 默认选择：目标
      target: {
        id: "",
        targetSubjectId: "", //默认：不选择
        name: "",
        description: "",
        validityType: "",
        validity: null,
        abilityList: [],
        planList: [],
        isActived: true,
        isFinished: false
      },
      targetSubject: {
        id: "",
        name: ""
      }
    })
  );
  provide(
    input_creatingTargetOrTargetSubject,
    reactive({
      inputType: "target", // 默认选择：目标
      target: {
        id: "",
        targetSubjectId: "", //默认：不选择
        name: "",
        description: "",
        validityType: "",
        validity: null,
        abilityList: [],
        planList: [],
        isActived: true,
        isFinished: false
      },
      targetSubject: {
        id: "",
        name: ""
      }
    })
  );
  provide(draggableOptions, {
    chosenClass: "draggable-chosen",
    ghostClass: "draggable-ghost",
    dragClass: "draggable-drag",
    delayOnTouchOnly: true, //开启触摸延时
    direction: "vertical", //拖动方向
    delay: 200, //延时时长
    touchStartThreshold: 3 //防止某些手机过于敏感(3~5 效果最好)
  });
  provide(colormap, [
    "#3846CF",
    "#FF5050",
    "#FF9300",
    "#007644",
    "#520076",
    "#536761",
    "#0A5CA7",
    "#009D97",
    "#59596F",
    "#CE0057"
  ]);
  provide(colormapForChart, [
    "#004182",
    "#118DF0",
    "#FF4A68",
    "#1A2634",
    "#203E5F",
    "#FFCD00",
    "#59596F"
  ]);
  provide(colormapPantone, [
    "#1B3C79",
    "#1A2634",
    "#91A8D0",
    "#039E7E",
    "#5F4B8B",
    "#F0C05A",
    "#D94F70",
    "#45B5AA"
  ]);
  provide(colormapForTreeChart, [
    "#F9385E",
    "#319BF7",
    "#5F4B8B",
    "#00BCAE",
    "#F0C05A",
    "#1B3C79",
    "#1A2634",
    "#5F4B8B",
    "#F0C05A",
    "#D94F70",
    "#45B5AA",
    "#91A8D0"
  ]);
  provide(levelRuleList, ref<AV.Object[]>([]));
  provide(abilityList, ref<AV.Object[]>([]));
  provide(
    input_editingAbility,
    reactive({
      id: "",
      name: "",
      targetList: [],
      planList: [],
      isActived: true,
      isFinished: false
    })
  );

  provide(
    input_creatingAbility,
    reactive({
      id: "",
      name: "",
      targetList: [],
      planList: [],
      isActived: true,
      isFinished: false
    })
  );
  provide(isEditAbilityDrawerDisplayed, ref(false));
  provide(isCreateAbilityDrawerDisplayed, ref(false));
  provide(isCurrentPageHome, ref(false));
  provide(tomatoStatStatusMode, ref<TomatoStatStatusMode>("simple"));
  provide(targetStatStatusMode, ref<StatStatusMode>("simple"));
  provide(planStatStatusMode, ref<StatStatusMode>("simple"));
  provide(abilityStatStatusMode, ref<StatStatusMode>("simple"));
  provide(tomatoList, ref<AV.Object[]>([]));
  provide(tomatoListWithDateRange, ref<AV.Object[]>([]));
  provide(averageLinearRegressionExpression, ref(""));
  provide(totalLinearRegressionExpression, ref(""));
  provide(
    dateRange,
    ref([
      new Date(
        new Date(UI.getTodayStartTimestamp(new Date().getTime())).getTime() -
          3600 * 1000 * 24 * 15
      ),
      new Date(UI.getTodayStartTimestamp(new Date().getTime()))
    ])
  );
  provide(totalLinearRegressionExpressionTime, ref(""));
  provide(bestDayInWeek, ref(""));
  provide(bestMonthInYear, ref(""));
  provide(thisYearTomatoList, ref<AV.Object[]>([]));
  provide(
    treeTotalStatData,
    ref<
      {
        name: string;
        totalTomatoNumber: number;
        totalTime: number;
      }[]
    >([])
  );
  provide(treeTotalStatDataIndex, ref<number>(0));
  provide(averageDailyStatData, ref([]));
  provide(tenThousandHoursPrediction, ref([]));
  provide(
    monthStatData,
    ref<
      {
        month: string;
        color: string;
        isShow: boolean;
        value: {
          totalTime: number;
          totalTomatoNumber: number;
          percent: number;
          name: string;
        }[];
      }[]
    >([])
  );
  provide(dateTip, ref("15 日"));
  provide(totalTime, ref("0 小时"));
  provide(totalTomatoNumber, ref("0 番茄"));
  provide(isLoginSuccess, ref(false));
  provide(
    input_creatingPlan,
    reactive<InputPlanType>({
      id: undefined,
      name: "",
      abilityList: [],
      targetList: [],
      type: "temporary",
      target: "",
      isActived: false,
      isFinished: false,
      deadline: ""
    })
  );
  provide(
    input_editingPlan,
    reactive<InputPlanType>({
      id: undefined,
      name: "",
      abilityList: [],
      targetList: [],
      type: "temporary",
      target: "",
      isActived: false,
      isFinished: false,
      deadline: ""
    })
  );
  provide(
    input_creatingTarget,
    reactive<InputTargetType>({
      id: undefined,
      subjectName: "",
      name: "",
      description: "",
      validityType: "",
      validity: "",
      planList: [],
      isActived: true,
      isFinished: false,
      mileStoneList: []
    })
  );
  provide(
    input_editingTarget,
    reactive<InputTargetType>({
      id: undefined,
      subjectName: "",
      name: "",
      description: "",
      validityType: "",
      validity: "",
      planList: [],
      isActived: true,
      isFinished: false,
      mileStoneList: []
    })
  );
  provide(isTargetBottomMenuShow, ref(false));
  provide(currentClickTarget, ref(null));
  provide(showLoading, ref(true));
  provide(loadingTitle, ref(""));
}

export default {
  useProvider,
  temporaryPlanList,
  completedPlanList,
  dailyPlanList,
  targetSubjectList,
  unSubjectiveTargetList,
  completedTargetList,
  tomatoCloudStatus,
  tomatoClockInterval,
  countDown,
  tomatoStartTime,
  isCreateTargetDrawerDisplayed,
  isEditTargetDrawerDisplayed,
  input_editingTargetOrTargetSubject,
  input_creatingTargetOrTargetSubject,
  draggableOptions,
  colormap,
  levelRuleList,
  abilityList,
  input_editingAbility,
  input_creatingAbility,
  isEditAbilityDrawerDisplayed,
  isCreateAbilityDrawerDisplayed,
  isCurrentPageHome,
  tomatoStatStatusMode,
  targetStatStatusMode,
  planStatStatusMode,
  colormapForChart,
  colormapPantone,
  colormapForTreeChart,
  abilityStatStatusMode,
  tomatoList,
  tomatoListWithDateRange,
  averageLinearRegressionExpression,
  totalLinearRegressionExpression,
  totalLinearRegressionExpressionTime,
  dateRange,
  bestDayInWeek,
  bestMonthInYear,
  thisYearTomatoList,
  treeTotalStatData,
  treeTotalStatDataIndex,
  averageDailyStatData,
  tenThousandHoursPrediction,
  monthStatData,
  dateTip,
  totalTime,
  totalTomatoNumber,
  isLoginSuccess,
  input_creatingPlan,
  input_editingPlan,
  input_creatingTarget,
  input_editingTarget,
  isTargetBottomMenuShow,
  currentClickTarget,
  showLoading,
  loadingTitle
};

(function () {
  const CLB_OPTIONS = [
    { value: "0", label: "未测试 / 低于 CLB4" },
    { value: "4", label: "CLB 4" },
    { value: "5", label: "CLB 5" },
    { value: "6", label: "CLB 6" },
    { value: "7", label: "CLB 7" },
    { value: "8", label: "CLB 8" },
    { value: "9", label: "CLB 9" },
    { value: "10", label: "CLB 10+" },
  ];

  const AGE_WITH_SPOUSE = {
    17: 0,
    18: 90,
    19: 95,
    20: 100,
    21: 100,
    22: 100,
    23: 100,
    24: 100,
    25: 100,
    26: 100,
    27: 100,
    28: 100,
    29: 100,
    30: 95,
    31: 90,
    32: 85,
    33: 80,
    34: 75,
    35: 70,
    36: 65,
    37: 60,
    38: 55,
    39: 50,
    40: 45,
    41: 35,
    42: 25,
    43: 15,
    44: 5,
    45: 0,
  };

  const AGE_NO_SPOUSE = {
    17: 0,
    18: 99,
    19: 105,
    20: 110,
    21: 110,
    22: 110,
    23: 110,
    24: 110,
    25: 110,
    26: 110,
    27: 110,
    28: 110,
    29: 110,
    30: 105,
    31: 99,
    32: 94,
    33: 88,
    34: 83,
    35: 77,
    36: 72,
    37: 66,
    38: 61,
    39: 55,
    40: 50,
    41: 39,
    42: 28,
    43: 17,
    44: 6,
    45: 0,
  };

  const CRS_EDU_WITH = {
    less_secondary: 0,
    secondary: 28,
    one_year: 84,
    two_year: 91,
    bachelor: 112,
    two_or_more: 119,
    master_or_professional: 126,
    phd: 140,
  };

  const CRS_EDU_NO = {
    less_secondary: 0,
    secondary: 30,
    one_year: 90,
    two_year: 98,
    bachelor: 120,
    two_or_more: 128,
    master_or_professional: 135,
    phd: 150,
  };

  const CRS_CAN_EXP_WITH = { 0: 0, 1: 35, 2: 46, 3: 56, 4: 63, 5: 70 };
  const CRS_CAN_EXP_NO = { 0: 0, 1: 40, 2: 53, 3: 64, 4: 72, 5: 80 };

  const CRS_SPOUSE_EDU = {
    less_secondary: 0,
    secondary: 2,
    one_year: 6,
    two_year: 7,
    bachelor: 8,
    two_or_more: 9,
    master_or_professional: 10,
    phd: 10,
  };

  const CRS_SPOUSE_CAN_EXP = { 0: 0, 1: 5, 2: 7, 3: 8, 4: 9, 5: 10 };

  const FSW_EDU = {
    less_secondary: 0,
    secondary: 5,
    one_year: 15,
    two_year: 19,
    bachelor: 21,
    two_or_more: 22,
    master_or_professional: 23,
    phd: 25,
  };

  const OINP_POINTS = {
    teer: { teer01: 10, teer23: 8, teer45: 0 },
    broad: { cat023: 10, cat7: 7, cat19: 5, cat48: 4, cat56: 3 },
    wage: { 40: 10, 35: 8, 30: 7, 25: 6, 20: 5, lt20: 0 },
    permit: { valid: 10, invalid: 0 },
    tenure: { ge6: 3, lt6: 0 },
    earnings: { ge40: 3, lt40: 0 },
    edu: {
      phdmd: 10,
      masters: 8,
      bachelor: 6,
      grad_diploma: 6,
      undergrad: 5,
      trade: 5,
      less: 0,
    },
    field: { stem: 12, business: 6, arts: 0 },
    canEdu: { multi: 10, one: 5, none: 0 },
    lang: { clb9: 10, clb8: 6, clb7: 4, clb6: 0 },
    official: { two: 10, one: 5 },
    jobRegion: { north: 10, outside_gta: 8, gta_no_tor: 3, toronto: 0 },
    studyRegion: {
      north: 10,
      outside_gta: 8,
      gta_no_tor: 3,
      toronto: 0,
      no_inperson: 0,
    },
  };

  const OINP_FACTORS_BY_STREAM = {
    fw: ["teer", "broad", "wage", "permit", "tenure", "earnings", "lang", "official", "jobRegion"],
    ids: ["broad", "wage", "permit", "tenure", "earnings", "jobRegion"],
    is: [
      "teer",
      "broad",
      "wage",
      "permit",
      "tenure",
      "earnings",
      "edu",
      "field",
      "canEdu",
      "lang",
      "official",
      "jobRegion",
      "studyRegion",
    ],
    masters: ["permit", "earnings", "edu", "field", "canEdu", "lang", "official", "studyRegion"],
    phd: ["permit", "earnings", "edu", "field", "canEdu", "lang", "official", "studyRegion"],
  };

  const OINP_FACTOR_LABELS = {
    teer: "Job Offer TEER",
    broad: "Job Offer Broad Category",
    wage: "Job Offer Wage",
    permit: "Work/Study Permit",
    tenure: "Job Tenure",
    earnings: "Earnings History",
    edu: "Highest Education",
    field: "Field of Study",
    canEdu: "Canadian Education Experience",
    lang: "Official Language Ability",
    official: "Knowledge of Official Languages",
    jobRegion: "Regional: Job Offer Location",
    studyRegion: "Regional: Study Location",
  };

  const tabs = Array.from(document.querySelectorAll(".tool-tab"));
  const panels = Array.from(document.querySelectorAll("[data-tool-panel]"));
  const controls = Array.from(document.querySelectorAll("[data-param]"));

  let activeTool = "crs";
  const defaultState = new Map();

  function fillClbSelect(selectId, defaultValue) {
    const el = document.getElementById(selectId);
    if (!el) return;
    CLB_OPTIONS.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      el.appendChild(option);
    });
    el.value = String(defaultValue);
  }

  function initClbSelects() {
    ["crs_l1_r", "crs_l1_w", "crs_l1_l", "crs_l1_s"].forEach((id) => fillClbSelect(id, 9));
    ["crs_l2_r", "crs_l2_w", "crs_l2_l", "crs_l2_s"].forEach((id) => fillClbSelect(id, 0));
    ["crs_sp_l_r", "crs_sp_l_w", "crs_sp_l_l", "crs_sp_l_s"].forEach((id) => fillClbSelect(id, 0));
    ["fsw_l1_r", "fsw_l1_w", "fsw_l1_l", "fsw_l1_s"].forEach((id) => fillClbSelect(id, 7));
  }

  function captureDefaultState() {
    controls.forEach((el) => {
      defaultState.set(el.id, getControlValue(el));
    });
  }

  function getControlValue(el) {
    if (el.type === "checkbox") {
      return el.checked ? "1" : "0";
    }
    return String(el.value);
  }

  function setControlValue(el, rawValue) {
    if (el.type === "checkbox") {
      el.checked = ["1", "true", "yes", "on"].includes(String(rawValue).toLowerCase());
      return;
    }
    const value = String(rawValue);
    if (el.tagName === "SELECT") {
      const hasOption = Array.from(el.options).some((o) => o.value === value);
      if (!hasOption) return;
    }
    el.value = value;
  }

  function applyLegacyParams(params) {
    const educationAlias = {
      less_than_secondary: "less_secondary",
      secondary: "secondary",
      one_year: "one_year",
      two_year: "two_year",
      bachelor: "bachelor",
      two_or_more: "two_or_more",
      master_or_professional: "master_or_professional",
      phd: "phd",
    };

    const mapIfMissing = (legacyKey, targetKey, transform) => {
      if (!params.has(targetKey) && params.has(legacyKey)) {
        const source = params.get(legacyKey);
        params.set(targetKey, transform ? transform(source) : source);
      }
    };

    mapIfMissing("age", "crs_age");
    mapIfMissing("checkbox_has_spouse", "crs_has_spouse", (v) => (v === "1" ? "1" : "0"));
    mapIfMissing("education", "crs_education", (v) => educationAlias[v] || "bachelor");
    mapIfMissing("spouse_education", "crs_spouse_education", (v) => educationAlias[v] || "secondary");
    mapIfMissing("canadian_exp", "crs_canadian_exp", (v) => (v === "" ? "0" : v));
    mapIfMissing("spouse_canadian_exp", "crs_spouse_canadian_exp", (v) => (v === "" ? "0" : v));
    mapIfMissing("foreign_exp", "crs_foreign_exp", (v) => {
      const n = Number(v || 0);
      if (n <= 0) return "0";
      if (n <= 2) return "1";
      return "3";
    });

    mapIfMissing("education_in_canada", "crs_canadian_edu", (v) => {
      const n = Number(v || 0);
      if (n <= 0) return "none";
      if (n <= 2) return "one_or_two_year";
      return "three_plus_year";
    });

    mapIfMissing("pa_1reading", "crs_l1_r");
    mapIfMissing("pa_1writing", "crs_l1_w");
    mapIfMissing("pa_1listening", "crs_l1_l");
    mapIfMissing("pa_1speaking", "crs_l1_s");

    mapIfMissing("pa_2reading", "crs_l2_r");
    mapIfMissing("pa_2writing", "crs_l2_w");
    mapIfMissing("pa_2listening", "crs_l2_l");
    mapIfMissing("pa_2speaking", "crs_l2_s");

    mapIfMissing("spouse_1reading", "crs_sp_l_r");
    mapIfMissing("spouse_1writing", "crs_sp_l_w");
    mapIfMissing("spouse_1listening", "crs_sp_l_l");
    mapIfMissing("spouse_1speaking", "crs_sp_l_s");

    if (!params.has("crs_french_bonus") && params.get("checkbox_nclc7") === "1") {
      if (params.get("checkbox_clb5") === "1") {
        params.set("crs_french_bonus", "nclc7_eng5");
      } else {
        params.set("crs_french_bonus", "nclc7_englow");
      }
    }

    if (!params.has("tool")) {
      const legacyKeys = [
        "age",
        "pa_1reading",
        "education",
        "canadian_exp",
        "foreign_exp",
        "checkbox_has_spouse",
      ];
      if (legacyKeys.some((k) => params.has(k))) {
        params.set("tool", "crs");
      }
    }
  }

  function applyUrlToControls() {
    const params = new URLSearchParams(window.location.search);
    applyLegacyParams(params);

    const tool = params.get("tool");
    if (tool && ["crs", "fsw", "oinp"].includes(tool)) {
      activeTool = tool;
    }

    controls.forEach((el) => {
      const key = el.dataset.param;
      if (!key || !params.has(key)) return;
      setControlValue(el, params.get(key));
    });
  }

  function toInt(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    return Number.parseInt(el.value, 10) || 0;
  }

  function toStr(id) {
    const el = document.getElementById(id);
    return el ? String(el.value) : "";
  }

  function firstLangPerAbilityPoints(clb, hasSpouse) {
    if (clb < 4) return 0;
    if (clb <= 5) return 6;
    if (clb === 6) return hasSpouse ? 8 : 9;
    if (clb === 7) return hasSpouse ? 16 : 17;
    if (clb === 8) return hasSpouse ? 22 : 23;
    if (clb === 9) return hasSpouse ? 29 : 31;
    return hasSpouse ? 32 : 34;
  }

  function secondLangPerAbilityPoints(clb) {
    if (clb <= 4) return 0;
    if (clb <= 6) return 1;
    if (clb <= 8) return 3;
    return 6;
  }

  function spouseLangPerAbilityPoints(clb) {
    if (clb <= 4) return 0;
    if (clb <= 6) return 1;
    if (clb <= 8) return 3;
    return 5;
  }

  function fswFirstLangPerAbilityPoints(clb) {
    if (clb >= 9) return 6;
    if (clb === 8) return 5;
    if (clb === 7) return 4;
    return 0;
  }

  function eduTransferGroup(edu) {
    if (edu === "less_secondary" || edu === "secondary") return 0;
    if (["two_or_more", "master_or_professional", "phd"].includes(edu)) return 2;
    return 1;
  }

  function scoreCRS() {
    const hasSpouse = toStr("crs_has_spouse") === "1";
    const age = toInt("crs_age");
    const edu = toStr("crs_education");
    const canExp = Math.min(5, toInt("crs_canadian_exp"));

    const l1 = [toInt("crs_l1_r"), toInt("crs_l1_w"), toInt("crs_l1_l"), toInt("crs_l1_s")];
    const l2 = [toInt("crs_l2_r"), toInt("crs_l2_w"), toInt("crs_l2_l"), toInt("crs_l2_s")];

    const coreAge = (hasSpouse ? AGE_WITH_SPOUSE : AGE_NO_SPOUSE)[Math.min(45, age)] || 0;
    const coreEdu = (hasSpouse ? CRS_EDU_WITH : CRS_EDU_NO)[edu] || 0;
    const coreLang1 = l1.reduce((sum, clb) => sum + firstLangPerAbilityPoints(clb, hasSpouse), 0);

    const l2Raw = l2.reduce((sum, clb) => sum + secondLangPerAbilityPoints(clb), 0);
    const l2Cap = hasSpouse ? 22 : 24;
    const coreLang2 = Math.min(l2Cap, l2Raw);

    const coreCan = (hasSpouse ? CRS_CAN_EXP_WITH : CRS_CAN_EXP_NO)[canExp] || 0;

    const coreTotal = coreAge + coreEdu + coreLang1 + coreLang2 + coreCan;

    let spouseEdu = 0;
    let spouseLang = 0;
    let spouseCan = 0;

    if (hasSpouse) {
      const spEdu = toStr("crs_spouse_education");
      const spCan = Math.min(5, toInt("crs_spouse_canadian_exp"));
      const spLangArr = [toInt("crs_sp_l_r"), toInt("crs_sp_l_w"), toInt("crs_sp_l_l"), toInt("crs_sp_l_s")];

      spouseEdu = CRS_SPOUSE_EDU[spEdu] || 0;
      spouseLang = spLangArr.reduce((sum, clb) => sum + spouseLangPerAbilityPoints(clb), 0);
      spouseCan = CRS_SPOUSE_CAN_EXP[spCan] || 0;
    }

    const spouseTotal = spouseEdu + spouseLang + spouseCan;

    const allL1AtLeast5 = l1.every((x) => x >= 5);
    const allL1AtLeast7 = l1.every((x) => x >= 7);
    const allL1AtLeast9 = l1.every((x) => x >= 9);

    const eduGroup = eduTransferGroup(edu);
    const foreignExp = toInt("crs_foreign_exp");
    const tradeCert = toStr("crs_trade_cert") === "1";

    let trEduLang = 0;
    if (allL1AtLeast7) {
      if (eduGroup === 1) trEduLang = allL1AtLeast9 ? 25 : 13;
      if (eduGroup === 2) trEduLang = allL1AtLeast9 ? 50 : 25;
    }

    let trEduCan = 0;
    if (canExp >= 1) {
      if (eduGroup === 1) trEduCan = canExp >= 2 ? 25 : 13;
      if (eduGroup === 2) trEduCan = canExp >= 2 ? 50 : 25;
    }

    let trForeignLang = 0;
    if (foreignExp > 0 && allL1AtLeast7) {
      if (allL1AtLeast9) {
        trForeignLang = foreignExp >= 3 ? 50 : 25;
      } else {
        trForeignLang = foreignExp >= 3 ? 25 : 13;
      }
    }

    let trForeignCan = 0;
    if (foreignExp > 0 && canExp >= 1) {
      if (canExp >= 2) {
        trForeignCan = foreignExp >= 3 ? 50 : 25;
      } else {
        trForeignCan = foreignExp >= 3 ? 25 : 13;
      }
    }

    let trCertLang = 0;
    if (tradeCert) {
      if (allL1AtLeast7) trCertLang = 50;
      else if (allL1AtLeast5) trCertLang = 25;
    }

    const transferTotal = Math.min(100, trEduLang + trEduCan + trForeignLang + trForeignCan + trCertLang);

    const sibling = toStr("crs_sibling") === "1" ? 15 : 0;
    const canEdu = { none: 0, one_or_two_year: 15, three_plus_year: 30 }[toStr("crs_canadian_edu")] || 0;
    const french = { none: 0, nclc7_englow: 25, nclc7_eng5: 50 }[toStr("crs_french_bonus")] || 0;
    const pnp = toStr("crs_pnp") === "1" ? 600 : 0;

    const additionalTotal = sibling + canEdu + french + pnp;
    const total = Math.min(1200, coreTotal + spouseTotal + transferTotal + additionalTotal);

    return {
      total,
      coreTotal,
      spouseTotal,
      transferTotal,
      additionalTotal,
      breakdown: {
        coreAge,
        coreEdu,
        coreLang1,
        coreLang2,
        coreCan,
        spouseEdu,
        spouseLang,
        spouseCan,
        trEduLang,
        trEduCan,
        trForeignLang,
        trForeignCan,
        trCertLang,
        sibling,
        canEdu,
        french,
        pnp,
      },
    };
  }

  function scoreFSW() {
    const age = toInt("fsw_age");
    const edu = toStr("fsw_education");
    const work = toInt("fsw_work_years");

    const lang = [toInt("fsw_l1_r"), toInt("fsw_l1_w"), toInt("fsw_l1_l"), toInt("fsw_l1_s")];

    const langMinEligible = lang.every((v) => v >= 7);
    const firstLang = lang.reduce((sum, clb) => sum + fswFirstLangPerAbilityPoints(clb), 0);
    const secondLang = toStr("fsw_second_lang") === "1" ? 4 : 0;

    const agePoints = (() => {
      if (age < 18) return 0;
      if (age <= 35) return 12;
      if (age >= 47) return 0;
      return Math.max(0, 12 - (age - 35));
    })();

    const eduPoints = FSW_EDU[edu] || 0;

    const workPoints = (() => {
      if (work >= 6) return 15;
      if (work >= 4) return 13;
      if (work >= 2) return 11;
      if (work >= 1) return 9;
      return 0;
    })();

    const arranged = toStr("fsw_arranged_employment") === "1" ? 10 : 0;

    const adaptRaw = [
      ["fsw_adapt_spouse_lang", 5],
      ["fsw_adapt_study_ca", 5],
      ["fsw_adapt_spouse_study_ca", 5],
      ["fsw_adapt_work_ca", 10],
      ["fsw_adapt_spouse_work_ca", 5],
      ["fsw_adapt_arranged", 5],
      ["fsw_adapt_relative", 5],
    ].reduce((sum, [id, points]) => {
      const el = document.getElementById(id);
      if (el && el.checked) return sum + points;
      return sum;
    }, 0);

    const adaptability = Math.min(10, adaptRaw);

    const total = firstLang + secondLang + agePoints + eduPoints + workPoints + arranged + adaptability;

    return {
      total,
      langMinEligible,
      breakdown: {
        firstLang,
        secondLang,
        agePoints,
        eduPoints,
        workPoints,
        arranged,
        adaptability,
      },
    };
  }

  function scoreOINP() {
    const stream = toStr("oinp_stream");
    const factors = OINP_FACTORS_BY_STREAM[stream] || OINP_FACTORS_BY_STREAM.is;

    const rawValues = {
      teer: OINP_POINTS.teer[toStr("oinp_teer")] || 0,
      broad: OINP_POINTS.broad[toStr("oinp_broad")] || 0,
      wage: OINP_POINTS.wage[toStr("oinp_wage")] || 0,
      permit: OINP_POINTS.permit[toStr("oinp_permit")] || 0,
      tenure: OINP_POINTS.tenure[toStr("oinp_tenure")] || 0,
      earnings: OINP_POINTS.earnings[toStr("oinp_earnings")] || 0,
      edu: OINP_POINTS.edu[toStr("oinp_edu")] || 0,
      field: OINP_POINTS.field[toStr("oinp_field")] || 0,
      canEdu: OINP_POINTS.canEdu[toStr("oinp_can_edu")] || 0,
      lang: OINP_POINTS.lang[toStr("oinp_lang")] || 0,
      official: OINP_POINTS.official[toStr("oinp_official")] || 0,
      jobRegion: OINP_POINTS.jobRegion[toStr("oinp_job_region")] || 0,
      studyRegion: OINP_POINTS.studyRegion[toStr("oinp_study_region")] || 0,
    };

    const maxPoints = {
      teer: 10,
      broad: 10,
      wage: 10,
      permit: 10,
      tenure: 3,
      earnings: 3,
      edu: 10,
      field: 12,
      canEdu: 10,
      lang: 10,
      official: 10,
      jobRegion: 10,
      studyRegion: 10,
    };

    const selectedBreakdown = factors.map((f) => ({
      key: f,
      label: OINP_FACTOR_LABELS[f],
      value: rawValues[f],
      max: maxPoints[f],
    }));

    const total = selectedBreakdown.reduce((sum, f) => sum + f.value, 0);
    const totalMax = selectedBreakdown.reduce((sum, f) => sum + f.max, 0);

    return { total, totalMax, stream, selectedBreakdown };
  }

  function renderCRS() {
    const result = scoreCRS();
    const target = document.getElementById("crs-result");
    if (!target) return;

    target.innerHTML = `
      <h3>CRS 结果</h3>
      <div class="score-line">总分 = Core + Spouse + Transferability + Additional</div>
      <div class="score-total">${result.total} / 1200</div>
      <div class="score-line">Core ${result.coreTotal} · Spouse ${result.spouseTotal} · Transferability ${result.transferTotal} · Additional ${result.additionalTotal}</div>
      <div class="score-line">提示：IRCC 已于 2025-03-25 取消 Job Offer CRS 额外加分。</div>
      <ul class="result-list">
        <li><span>年龄</span><strong>${result.breakdown.coreAge}</strong></li>
        <li><span>学历</span><strong>${result.breakdown.coreEdu}</strong></li>
        <li><span>第一官方语言</span><strong>${result.breakdown.coreLang1}</strong></li>
        <li><span>第二官方语言（封顶后）</span><strong>${result.breakdown.coreLang2}</strong></li>
        <li><span>加拿大工作经验</span><strong>${result.breakdown.coreCan}</strong></li>
      </ul>
    `;
  }

  function renderFSW() {
    const result = scoreFSW();
    const target = document.getElementById("fsw-result");
    if (!target) return;

    const pass = result.langMinEligible && result.total >= 67;
    const statusText = !result.langMinEligible
      ? "不满足 FSW 最低语言门槛：四项第一官方语言需至少 CLB7"
      : pass
      ? "达到 FSW 67 分门槛，可进入资格层面下一步"
      : "未达到 FSW 67 分门槛";

    target.innerHTML = `
      <h3>FSW 结果</h3>
      <div class="score-total">${result.total} / 100</div>
      <span class="${pass ? "status-ok" : "status-warn"}">${statusText}</span>
      <ul class="result-list">
        <li><span>第一官方语言</span><strong>${result.breakdown.firstLang}</strong></li>
        <li><span>第二官方语言</span><strong>${result.breakdown.secondLang}</strong></li>
        <li><span>年龄</span><strong>${result.breakdown.agePoints}</strong></li>
        <li><span>学历</span><strong>${result.breakdown.eduPoints}</strong></li>
        <li><span>工作经验</span><strong>${result.breakdown.workPoints}</strong></li>
        <li><span>安排就业</span><strong>${result.breakdown.arranged}</strong></li>
        <li><span>适应力（已封顶）</span><strong>${result.breakdown.adaptability}</strong></li>
      </ul>
    `;
  }

  function streamName(stream) {
    return (
      {
        fw: "Employer Job Offer: Foreign Worker",
        ids: "Employer Job Offer: In-Demand Skills",
        is: "Employer Job Offer: International Student",
        masters: "Masters Graduate",
        phd: "PhD Graduate",
      }[stream] || stream
    );
  }

  function renderOINP() {
    const result = scoreOINP();
    const target = document.getElementById("oinp-result");
    if (!target) return;

    const list = result.selectedBreakdown
      .map(
        (f) => `<li><span>${f.label}</span><strong>${f.value} / ${f.max}</strong></li>`
      )
      .join("");

    target.innerHTML = `
      <h3>OINP EOI 结果</h3>
      <div class="score-line">当前流派：${streamName(result.stream)}</div>
      <div class="score-total">${result.total} / ${result.totalMax}</div>
      <div class="score-line">说明：各轮邀请还会叠加定向职业/区域等抽签条件。</div>
      <ul class="result-list">${list}</ul>
    `;
  }

  function renderAll() {
    renderCRS();
    renderFSW();
    renderOINP();
  }

  function setActiveTool(tool, syncUrl = true) {
    activeTool = ["crs", "fsw", "oinp"].includes(tool) ? tool : "crs";

    tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tool === activeTool));
    panels.forEach((panel) =>
      panel.classList.toggle("is-active", panel.dataset.toolPanel === activeTool)
    );

    if (syncUrl) updateUrl();
  }

  function buildParams() {
    const params = new URLSearchParams();
    params.set("tool", activeTool);

    controls.forEach((el) => {
      const key = el.dataset.param;
      if (!key) return;
      const value = getControlValue(el);
      const defaultValue = defaultState.get(el.id);
      if (value !== defaultValue) {
        params.set(key, value);
      }
    });

    return params;
  }

  function updateUrl() {
    const params = buildParams();
    const query = params.toString();
    const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, "", next);
  }

  async function copyLink() {
    const full = window.location.href;
    try {
      await navigator.clipboard.writeText(full);
      alert("分享链接已复制。\n" + full);
    } catch (err) {
      alert("复制失败，请手动复制：\n" + full);
    }
  }

  function bindEvents() {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActiveTool(tab.dataset.tool, true);
      });
    });

    controls.forEach((el) => {
      el.addEventListener("change", () => {
        renderAll();
        updateUrl();
      });
    });

    document.querySelectorAll("[data-copy-link]").forEach((btn) => {
      btn.addEventListener("click", copyLink);
    });
  }

  function boot() {
    initClbSelects();
    captureDefaultState();
    applyUrlToControls();
    setActiveTool(activeTool, false);
    renderAll();
    updateUrl();
    bindEvents();
  }

  boot();
})();

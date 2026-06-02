/*
  Digital Resume shared JavaScript
  Handles:
  - Smooth scrolling for same-page anchors
  - Dark mode toggle with localStorage
  - Optional ECharts skills radar chart
  - Optional contact form submission via Formspree
*/

(function () {
  "use strict";

  const chartOptions = {
    index: {
      indicators: [
        { name: "Solution Architecture", max: 100 },
        { name: "Technical Analysis", max: 100 },
        { name: "Enterprise Integration", max: 100 },
        { name: "System Design", max: 100 },
        { name: "Reliability Engineering", max: 100 },
        { name: "Infrastructure Management", max: 100 },
      ],
      values: [70, 95, 80, 90, 88, 82],
    },
    default: {
      indicators: [
        { name: "Cloud Architecture", max: 100 },
        { name: "Technical Analysis", max: 100 },
        { name: "Backend Development", max: 100 },
        { name: "System Design", max: 100 },
        { name: "API Development", max: 100 },
        { name: "Infrastructure Management", max: 100 },
      ],
      values: [70, 95, 80, 90, 88, 82],
    },
  };

  let skillsChart = null;

  function isDarkMode() {
    return document.documentElement.classList.contains("dark");
  }

  function getChartTextColor() {
    return isDarkMode() ? "#e5e7eb" : "#1f2937";
  }

  function getChartTooltipOptions() {
    return {
      backgroundColor: isDarkMode()
        ? "rgba(31, 41, 55, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      borderColor: isDarkMode() ? "#374151" : "#e0e7ff",
      textStyle: {
        color: getChartTextColor(),
      },
    };
  }

  function getCurrentPageKey() {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("/") || path.endsWith("/index.html") || path.endsWith("index")) {
      return "index";
    }

    return "default";
  }

  function initialiseSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const targetElement = document.querySelector(targetId);

        if (!targetElement) {
          return;
        }

        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  function updateChartTheme(themeToggle) {
    if (!skillsChart) {
      return;
    }

    skillsChart.setOption({
      radar: {
        axisName: {
          color: themeToggle && themeToggle.checked ? "#e5e7eb" : "#1f2937",
        },
      },
      tooltip: getChartTooltipOptions(),
    });
  }

  function initialiseThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");

      if (themeToggle) {
        themeToggle.checked = true;
      }
    }

    if (!themeToggle) {
      return;
    }

    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      updateChartTheme(this);
    });
  }

  function initialiseSkillsChart() {
    const skillsChartElement = document.getElementById("skills-chart");

    if (!skillsChartElement || !window.echarts) {
      return;
    }

    const pageConfig = chartOptions[getCurrentPageKey()] || chartOptions.default;
    skillsChart = window.echarts.init(skillsChartElement);

    const skillsOption = {
      animation: false,
      radar: {
        indicator: pageConfig.indicators,
        radius: "65%",
        splitNumber: 4,
        axisName: {
          color: getChartTextColor(),
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: "rgba(87, 181, 231, 0.1)",
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)"],
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(87, 181, 231, 0.3)",
          },
        },
      },
      series: [
        {
          name: "Skills",
          type: "radar",
          data: [
            {
              value: pageConfig.values,
              name: "Technical Expertise",
              areaStyle: {
                color: "rgba(87, 181, 231, 0.1)",
              },
              lineStyle: {
                color: "rgba(87, 181, 231, 1)",
                width: 2,
              },
              itemStyle: {
                color: "rgba(87, 181, 231, 1)",
              },
            },
          ],
        },
      ],
      tooltip: {
        ...getChartTooltipOptions(),
        formatter: function (params) {
          return params.name + ": " + params.value;
        },
      },
    };

    skillsChart.setOption(skillsOption);

    window.addEventListener("resize", function () {
      if (skillsChart) {
        skillsChart.resize();
      }
    });
  }

  function initialiseContactForm() {
    const form = document.getElementById("contactForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          showSuccessMessage();
          form.reset();
        } else {
          alert("Oops! Something went wrong.");
        }
      }).catch(() => {
        alert("Oops! Something went wrong.");
      });
    });
  }

  window.showSuccessMessage = function () {
    const successMessage = document.getElementById("successMessage");

    if (successMessage) {
      successMessage.classList.remove("hidden");
    }
  };

  window.hideSuccessMessage = function () {
    const successMessage = document.getElementById("successMessage");

    if (successMessage) {
      successMessage.classList.add("hidden");
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    initialiseSmoothScrolling();
    initialiseThemeToggle();
    initialiseSkillsChart();
    initialiseContactForm();
  });
})();

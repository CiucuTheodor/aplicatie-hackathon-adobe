/**
 * BRANDVISION – SaaS Observability
 * Interactive Frontend Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // State Management
  const state = {
    activeTab: 'overview',
    activeSidebar: 'analytics',
    period: '30d',
    channelFilter: 'All Channels',
    dateRange: 'Aug 01 – Oct 31, 2023',
    allFilter: 'All Filter',
    feedFilter: 'all'
  };

  // ==========================================================================
  // Mock Datasets
  // ==========================================================================

  // Widget 1: Share of Voice
  const shareOfVoiceData = {
    labels: ['Your Brand', 'Competitor A', 'Competitor B', 'Others'],
    values: [42, 28, 18, 12],
    colors: ['#19D9A0', '#2185F5', '#F59E35', '#8995A7']
  };

  // Widget 2: Detection Trends Datasets
  const trendDatasets = {
    '30d': {
      labels: ['Oct 01', 'Oct 04', 'Oct 07', 'Oct 10', 'Oct 13', 'Oct 16', 'Oct 19', 'Oct 22', 'Oct 25', 'Oct 28', 'Oct 31'],
      brand: [11200, 13400, 12100, 16800, 15200, 21500, 18900, 24200, 22100, 23800, 24800],
      competitor: [9800, 10200, 11400, 12300, 13900, 14200, 13100, 15600, 16800, 17200, 16400]
    },
    '60d': {
      labels: ['Sep 01', 'Sep 08', 'Sep 15', 'Sep 22', 'Sep 30', 'Oct 07', 'Oct 14', 'Oct 21', 'Oct 31'],
      brand: [9500, 11800, 17200, 14300, 13900, 15100, 19800, 23400, 24800],
      competitor: [8900, 9400, 10500, 11200, 10800, 11400, 13200, 15100, 16400]
    },
    '90d': {
      labels: ['Aug 01', 'Aug 15', 'Aug 30', 'Sep 15', 'Sep 30', 'Oct 15', 'Oct 31'],
      brand: [7800, 9400, 10600, 18500, 14200, 21900, 24800],
      competitor: [8200, 8800, 9100, 11200, 11800, 14500, 16400]
    }
  };

  // Widget 3: Live Mentions
  const liveMentions = [
    {
      id: 'm1',
      time: '10:24 AM',
      timeAgo: '2m ago',
      source: 'Twitter',
      sourceIcon: '𝕏',
      sourceColor: '#2185F5',
      sentiment: 'positive',
      text: 'Switched our cluster observability stack to BrandVision. The telemetry alerts caught a memory spike 20m before Datadog!',
      target: 'Datadog',
      targetClass: 'orange'
    },
    {
      id: 'm2',
      time: '10:18 AM',
      timeAgo: '8m ago',
      source: 'Reddit',
      sourceIcon: 'RD',
      sourceColor: '#FF4500',
      sentiment: 'positive',
      text: 'r/devops: Honest review of BrandVision after 90 days in production. Thread inside on query latency and APM overhead.',
      target: 'Dynatrace',
      targetClass: 'orange'
    },
    {
      id: 'm3',
      time: '10:05 AM',
      timeAgo: '21m ago',
      source: 'News',
      sourceIcon: 'TC',
      sourceColor: '#19D9A0',
      sentiment: 'neutral',
      text: 'TechCrunch: SaaS Observability landscape shifts as AI-native telemetry platforms gain enterprise market share.',
      target: 'Comp A',
      targetClass: 'orange'
    },
    {
      id: 'm4',
      time: '09:47 AM',
      timeAgo: '39m ago',
      source: 'Twitter',
      sourceIcon: '𝕏',
      sourceColor: '#2185F5',
      sentiment: 'negative',
      text: 'Still waiting on the new webhook rate limiting docs. Competitor B had this feature out last quarter.',
      target: 'Comp B',
      targetClass: 'orange'
    },
    {
      id: 'm5',
      time: '09:22 AM',
      timeAgo: '1h ago',
      source: 'Google',
      sourceIcon: 'G2',
      sourceColor: '#F59E35',
      sentiment: 'positive',
      text: 'G2 Crowd Review: "BrandVision automated our entire competitor tracking workflow. 5/5 stars for AI trend detection."',
      target: 'BrandVision',
      targetClass: 'emerald'
    },
    {
      id: 'm6',
      time: '08:50 AM',
      timeAgo: '2h ago',
      source: 'Instagram',
      sourceIcon: 'IG',
      sourceColor: '#E1306C',
      sentiment: 'neutral',
      text: 'Behind the scenes at KubeCon! Testing BrandVision real-time anomaly detection booth demo.',
      target: 'BrandVision',
      targetClass: 'emerald'
    }
  ];

  // Widget 4: Sentiment Analysis Over Time
  const sentimentData = {
    labels: ['August', 'September', 'October', 'November'],
    datasets: [
      {
        label: 'Positive',
        data: [35, 62, 84, 92],
        borderColor: '#19D9A0',
        backgroundColor: 'rgba(25, 217, 160, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5
      },
      {
        label: 'Negative',
        data: [-15, -28, -12, -8],
        borderColor: '#F59E35',
        backgroundColor: 'rgba(245, 158, 53, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2
      },
      {
        label: 'Neutral',
        data: [42, 48, 54, 60],
        borderColor: '#8995A7',
        tension: 0.35,
        borderWidth: 1.5
      },
      {
        label: 'Comp A',
        data: [20, 38, 52, 64],
        borderColor: '#E2E8F0',
        borderDash: [4, 4],
        tension: 0.35,
        borderWidth: 1.5
      },
      {
        label: 'Comp B',
        data: [-5, 12, -18, 5],
        borderColor: '#ECC94B',
        borderDash: [5, 5],
        tension: 0.35,
        borderWidth: 1.5
      }
    ]
  };

  // ==========================================================================
  // Custom Chart.js Global Settings
  // ==========================================================================
  Chart.defaults.color = '#8995A7';
  Chart.defaults.font.family = 'Inter, sans-serif';

  // ==========================================================================
  // 1. Initialise Widget 1: Competitor Share of Voice Bar Chart
  // ==========================================================================
  const ctxVoice = document.getElementById('shareOfVoiceCanvas')?.getContext('2d');
  let shareOfVoiceChart = null;

  if (ctxVoice) {
    // Custom Plugin to draw percentage values on top of bars
    const topBarLabelPlugin = {
      id: 'topBarLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, index) => {
            const val = dataset.data[index];
            ctx.fillStyle = '#F3F6FA';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(val + '%', bar.x, bar.y - 8);
          });
        });
      }
    };

    // Create subtle bar gradients
    const gradBrand = ctxVoice.createLinearGradient(0, 0, 0, 220);
    gradBrand.addColorStop(0, '#19D9A0');
    gradBrand.addColorStop(1, '#0B7354');

    const gradCompA = ctxVoice.createLinearGradient(0, 0, 0, 220);
    gradCompA.addColorStop(0, '#2185F5');
    gradCompA.addColorStop(1, '#114C91');

    const gradCompB = ctxVoice.createLinearGradient(0, 0, 0, 220);
    gradCompB.addColorStop(0, '#F59E35');
    gradCompB.addColorStop(1, '#9C5D14');

    const gradOthers = ctxVoice.createLinearGradient(0, 0, 0, 220);
    gradOthers.addColorStop(0, '#8995A7');
    gradOthers.addColorStop(1, '#4A5668');

    shareOfVoiceChart = new Chart(ctxVoice, {
      type: 'bar',
      data: {
        labels: shareOfVoiceData.labels,
        datasets: [
          {
            data: shareOfVoiceData.values,
            backgroundColor: [gradBrand, gradCompA, gradCompB, gradOthers],
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 36
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0D1728',
            borderColor: '#26364B',
            borderWidth: 1,
            titleColor: '#F3F6FA',
            bodyColor: '#A0AEC0',
            padding: 8,
            callbacks: {
              label: (context) => `Share of Voice: ${context.parsed.y}%`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#8995A7',
              font: { size: 10 }
            },
            border: { color: '#26364B' }
          },
          y: {
            min: 0,
            max: 60,
            ticks: {
              stepSize: 15,
              callback: (val) => val + '%',
              color: '#8995A7',
              font: { size: 10 }
            },
            grid: {
              color: '#1E2D42',
              drawBorder: false
            },
            border: { color: '#26364B' }
          }
        }
      },
      plugins: [topBarLabelPlugin]
    });
  }

  // ==========================================================================
  // 2. Initialise Widget 2: Brand Detection Trends Area Chart
  // ==========================================================================
  const ctxTrends = document.getElementById('brandDetectionCanvas')?.getContext('2d');
  let detectionChart = null;

  if (ctxTrends) {
    const gradBrandArea = ctxTrends.createLinearGradient(0, 0, 0, 220);
    gradBrandArea.addColorStop(0, 'rgba(25, 217, 160, 0.35)');
    gradBrandArea.addColorStop(1, 'rgba(25, 217, 160, 0.0)');

    const gradCompArea = ctxTrends.createLinearGradient(0, 0, 0, 220);
    gradCompArea.addColorStop(0, 'rgba(245, 158, 53, 0.28)');
    gradCompArea.addColorStop(1, 'rgba(245, 158, 53, 0.0)');

    const initialData = trendDatasets['30d'];

    detectionChart = new Chart(ctxTrends, {
      type: 'line',
      data: {
        labels: initialData.labels,
        datasets: [
          {
            label: 'Competitor Mentions',
            data: initialData.competitor,
            borderColor: '#F59E35',
            backgroundColor: gradCompArea,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#0D1728',
            pointHoverBorderColor: '#F59E35',
            pointHoverBorderWidth: 2
          },
          {
            label: 'Brand Mentions',
            data: initialData.brand,
            borderColor: '#19D9A0',
            backgroundColor: gradBrandArea,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#0D1728',
            pointHoverBorderColor: '#19D9A0',
            pointHoverBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0D1728',
            borderColor: '#26364B',
            borderWidth: 1,
            titleColor: '#F3F6FA',
            bodyColor: '#A0AEC0',
            padding: 10,
            boxPadding: 4,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.parsed.y.toLocaleString()} mentions`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(30, 45, 66, 0.4)',
              drawBorder: false
            },
            ticks: {
              color: '#8995A7',
              font: { size: 10 }
            },
            border: { color: '#26364B' }
          },
          y: {
            min: 0,
            max: 25000,
            ticks: {
              stepSize: 5000,
              callback: (val) => (val === 0 ? '0' : val / 1000 + 'k'),
              color: '#8995A7',
              font: { size: 10 }
            },
            grid: {
              color: '#1E2D42',
              drawBorder: false
            },
            border: { color: '#26364B' }
          }
        }
      }
    });
  }

  // ==========================================================================
  // 3. Populate Widget 3: Live Brand Mentions Feed
  // ==========================================================================
  const feedListElem = document.getElementById('liveFeedList');

  function renderFeed(filter = 'all') {
    if (!feedListElem) return;
    feedListElem.innerHTML = '';

    const filtered = liveMentions.filter((item) => {
      if (filter === 'all') return true;
      return item.sentiment === filter;
    });

    filtered.forEach((mention) => {
      const row = document.createElement('div');
      row.className = 'feed-row';

      // Sentiment icon
      let sentimentSvg = '';
      if (mention.sentiment === 'positive') {
        sentimentSvg = `<span style="color: var(--color-emerald);"><i data-lucide="smile" style="width: 14px; height: 14px;"></i></span>`;
      } else if (mention.sentiment === 'negative') {
        sentimentSvg = `<span style="color: var(--color-orange);"><i data-lucide="frown" style="width: 14px; height: 14px;"></i></span>`;
      } else {
        sentimentSvg = `<span style="color: var(--color-yellow);"><i data-lucide="meh" style="width: 14px; height: 14px;"></i></span>`;
      }

      row.innerHTML = `
        <div class="feed-time">
          <span class="feed-time-text">${mention.time}</span>
          <span class="feed-time-ago">${mention.timeAgo}</span>
        </div>
        <div class="feed-source">
          <div class="feed-source-icon" style="color: ${mention.sourceColor};">
            ${mention.sourceIcon}
          </div>
          <span>${mention.source}</span>
        </div>
        <div class="feed-sentiment-icon">
          ${sentimentSvg}
        </div>
        <div class="feed-text" title="${mention.text}">
          ${mention.text}
        </div>
        <div class="feed-target-badge">
          <span class="target-pill ${mention.targetClass}">${mention.target}</span>
        </div>
      `;

      feedListElem.appendChild(row);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  renderFeed('all');

  // Feed Filter Buttons
  const feedFilterBtns = document.querySelectorAll('.feed-filter-btn');
  feedFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      feedFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const sent = btn.getAttribute('data-sent');
      state.feedFilter = sent;
      renderFeed(sent);
    });
  });

  // ==========================================================================
  // 4. Initialise Widget 4: Sentiment Analysis Over Time Chart
  // ==========================================================================
  const ctxSentiment = document.getElementById('sentimentAnalysisCanvas')?.getContext('2d');
  let sentimentChart = null;

  if (ctxSentiment) {
    sentimentChart = new Chart(ctxSentiment, {
      type: 'line',
      data: sentimentData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0D1728',
            borderColor: '#26364B',
            borderWidth: 1,
            titleColor: '#F3F6FA',
            bodyColor: '#A0AEC0',
            padding: 8,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.parsed.y > 0 ? '+' : ''}${item.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(30, 45, 66, 0.4)',
              drawBorder: false
            },
            ticks: {
              color: '#8995A7',
              font: { size: 10 }
            },
            border: { color: '#26364B' }
          },
          y: {
            min: -50,
            max: 100,
            ticks: {
              stepSize: 25,
              callback: (val) => (val > 0 ? '+' + val : val),
              color: '#8995A7',
              font: { size: 9 }
            },
            grid: {
              color: '#1E2D42',
              drawBorder: false
            },
            border: { color: '#26364B' }
          }
        }
      }
    });

    // Legend toggles for sentiment chart
    const sentimentLegendItems = document.querySelectorAll('.w4-legend-item');
    sentimentLegendItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        const seriesIndex = parseInt(btn.getAttribute('data-series'), 10);
        const meta = sentimentChart.getDatasetMeta(seriesIndex);
        meta.hidden = meta.hidden === null ? !sentimentChart.data.datasets[seriesIndex].hidden : null;
        btn.classList.toggle('active', !meta.hidden);
        sentimentChart.update();
      });
    });
  }

  // ==========================================================================
  // 5. Interactive Dropdowns & Period Switching
  // ==========================================================================

  // Period Selector (30d, 60d, 90d)
  const periodTrigger = document.getElementById('periodTrigger');
  const periodMenu = document.getElementById('periodMenu');
  const periodLabel = document.getElementById('periodLabel');

  if (periodTrigger && periodMenu) {
    periodTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      periodMenu.classList.toggle('show');
    });

    periodMenu.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        const selected = item.getAttribute('data-period');
        state.period = selected;
        if (periodLabel) periodLabel.textContent = item.textContent;

        periodMenu.querySelectorAll('.dropdown-item').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        periodMenu.classList.remove('show');

        // Update Detection Chart with new data
        if (detectionChart && trendDatasets[selected]) {
          const newData = trendDatasets[selected];
          detectionChart.data.labels = newData.labels;
          detectionChart.data.datasets[0].data = newData.competitor;
          detectionChart.data.datasets[1].data = newData.brand;
          detectionChart.update();
        }
      });
    });
  }

  // Date Range Dropdown
  const dateTrigger = document.getElementById('dateRangeTrigger');
  const dateMenu = document.getElementById('dateRangeMenu');
  const dateLabel = document.getElementById('dateRangeLabel');

  if (dateTrigger && dateMenu) {
    dateTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dateMenu.classList.toggle('show');
    });

    dateMenu.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-val');
        state.dateRange = val;
        if (dateLabel) dateLabel.textContent = val;

        dateMenu.querySelectorAll('.dropdown-item').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        dateMenu.classList.remove('show');
      });
    });
  }

  // Filter Dropdown
  const filterTrigger = document.getElementById('filterTrigger');
  const filterMenu = document.getElementById('filterMenu');
  const filterLabel = document.getElementById('filterLabel');

  if (filterTrigger && filterMenu) {
    filterTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      filterMenu.classList.toggle('show');
    });

    filterMenu.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-val');
        state.channelFilter = val;
        if (filterLabel) filterLabel.textContent = val;

        filterMenu.querySelectorAll('.dropdown-item').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        filterMenu.classList.remove('show');
      });
    });
  }

  // All Filter Dropdown in Widget 2
  const allFilterTrigger = document.getElementById('allFilterTrigger');
  const allFilterMenu = document.getElementById('allFilterMenu');
  const allFilterLabel = document.getElementById('allFilterLabel');

  if (allFilterTrigger && allFilterMenu) {
    allFilterTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      allFilterMenu.classList.toggle('show');
    });

    allFilterMenu.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-allfilter');
        state.allFilter = val;
        if (allFilterLabel) allFilterLabel.textContent = val;

        allFilterMenu.querySelectorAll('.dropdown-item').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        allFilterMenu.classList.remove('show');
      });
    });
  }

  // Notification Bell Toggle
  const notifBtn = document.getElementById('notifBellBtn');
  const notifFlyout = document.getElementById('notificationsFlyout');
  const unreadDot = document.getElementById('unreadNotifDot');

  if (notifBtn && notifFlyout) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifFlyout.classList.toggle('show');
      if (unreadDot) unreadDot.style.display = 'none';
    });
  }

  // User Profile Dropdown Toggle
  const userProfileBtn = document.getElementById('userProfileBtn');
  const profileMenu = document.getElementById('profileDropdownMenu');

  if (userProfileBtn && profileMenu) {
    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('show');
    });
  }

  // Close all open menus when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu, .notifications-flyout, .profile-dropdown-menu').forEach((menu) => {
      menu.classList.remove('show');
    });
  });

  // ==========================================================================
  // 6. Navigation Tabs Switching
  // ==========================================================================
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabViews = {
    overview: document.getElementById('view-overview'),
    competitors: document.getElementById('view-competitors'),
    mentions: document.getElementById('view-mentions'),
    alerts: document.getElementById('view-alerts'),
    reports: document.getElementById('view-reports')
  };

  navTabs.forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      const targetTab = tabBtn.getAttribute('data-tab');
      state.activeTab = targetTab;

      navTabs.forEach((b) => b.classList.remove('active'));
      tabBtn.classList.add('active');

      Object.entries(tabViews).forEach(([key, viewElem]) => {
        if (!viewElem) return;
        if (key === targetTab) {
          viewElem.classList.add('active-view');
        } else {
          viewElem.classList.remove('active-view');
        }
      });

      // Special case: if mentions tab is clicked, also render full mentions
      if (targetTab === 'mentions') {
        const fullTable = document.getElementById('fullMentionsTable');
        if (fullTable) {
          fullTable.innerHTML = feedListElem.innerHTML;
        }
      }

      // Resize charts if overview becomes active again
      if (targetTab === 'overview') {
        setTimeout(() => {
          shareOfVoiceChart?.resize();
          detectionChart?.resize();
          sentimentChart?.resize();
        }, 50);
      }
    });
  });

  // ==========================================================================
  // 7. Sidebar Navigation Switching
  // ==========================================================================
  const sidebarBtns = document.querySelectorAll('.sidebar-icon-btn');
  sidebarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-sidebar');
      if (item) {
        state.activeSidebar = item;
        sidebarBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 8. Refresh Action Simulation
  // ==========================================================================
  const refreshBtn = document.getElementById('refreshBtn');
  const refreshIcon = document.getElementById('refreshIcon');

  if (refreshBtn && refreshIcon) {
    refreshBtn.addEventListener('click', () => {
      refreshIcon.style.transition = 'transform 0.6s ease';
      refreshIcon.style.transform = 'rotate(360deg)';

      setTimeout(() => {
        refreshIcon.style.transition = 'none';
        refreshIcon.style.transform = 'rotate(0deg)';
      }, 650);

      // Random jitter to simulate real-time live telemetry update
      if (detectionChart) {
        const currentData = trendDatasets[state.period];
        const jitterBrand = currentData.brand.map((v) => v + Math.floor((Math.random() - 0.4) * 600));
        detectionChart.data.datasets[1].data = jitterBrand;
        detectionChart.update();
      }
    });
  }

  // Export action
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      alert('Generating executive PDF & CSV summary report for BRANDVISION...');
    });
  }
});

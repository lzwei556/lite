export const fakeReport = {
  id: 1229,
  start: 1754006400,
  end: 1756684799,
  reportDate: 1756684800,
  reportName: 'QATest',
  assetsStat: {
    normalAlarmNum: 6,
    minorAlarmNum: 0,
    majorAlarmNum: 0,
    criticalAlarmNum: 0
  },
  monitoringPointsStat: {
    normalAlarmNum: 28,
    minorAlarmNum: 0,
    majorAlarmNum: 0,
    criticalAlarmNum: 0
  },
  devicesStat: {
    onlineNum: 0,
    offlineNum: 28
  },
  alarmRecordsStat: {
    minorAlarmNum: 0,
    majorAlarmNum: 0,
    criticalAlarmNum: 0,
    handledNum: 0,
    unhandledNum: 0
  },
  alarmRecords: Array(16).fill({
    id: 216,
    alarmRuleGroupName: '电机振动异常',
    alarmRuleGroupId: 89,
    metric: {
      key: 'vibration_severity.vibration_severity_z',
      name: 'FIELD_VELOCITY_RMS:AXIS_Z',
      unit: 'mm/s'
    },
    source: {
      id: 608,
      name: 'Good vibration motor big big long long SVT510P',
      type: 10401,
      assetId: 181,
      attributes: {
        axial: 'x',
        horizontal: 'z',
        index: 3,
        vertical: 'y'
      },
      bindingDevices: [
        {
          id: 1014,
          name: 'svt02',
          macAddress: 'e6eb939e3c39',
          parent: 'fd89331d8625',
          parentName: 'Gateway-test01',
          typeId: 327943,
          category: 0,
          channel: 0,
          protocol: 2,
          network: {
            id: 126,
            name: 'Gateway',
            gateway: {
              id: 0,
              name: '',
              macAddress: '',
              parent: '',
              parentName: '',
              typeId: 0,
              category: 0,
              channel: 0,
              information: {
                name: '',
                model: '',
                manufacturer: '',
                firmware_version: '',
                firmware_build_time: '',
                ble_mark: '',
                ip_address: '',
                subnet_mask: '',
                gateway: '',
                product_id: 0,
                timestamp: 0,
                iccid_4g: ''
              },
              state: {
                isOnline: false,
                connectedAt: 0,
                batteryLevel: 0,
                signalLevel: 0,
                batteryVoltage: 0,
                acquisitionIsEnabled: false
              }
            },
            nodes: null,
            communicationPeriod: 0,
            communicationPeriod2: 0,
            communicationOffset: 0,
            groupSize: 0,
            groupSize2: 0,
            intervalCnt: 0,
            mode: 0
          },
          information: {
            name: '',
            model: '',
            manufacturer: '',
            firmware_version: 'v1.6.9',
            firmware_build_time: '2024-09-06 17:52:42',
            ble_mark: '',
            ip_address: '',
            subnet_mask: '',
            gateway: '',
            product_id: 80810,
            timestamp: 0,
            iccid_4g: ''
          },
          state: {
            isOnline: false,
            connectedAt: 0,
            batteryLevel: 0,
            signalLevel: -31,
            batteryVoltage: 3596,
            acquisitionIsEnabled: false
          },
          properties: [
            {
              name: 'FIELD_VELOCITY_RMS',
              key: 'vibration_severity',
              unit: 'mm/s',
              sort: 1,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'vibration_severity_x',
                  dataIndex: 7
                },
                {
                  name: 'AXIS_Y',
                  key: 'vibration_severity_y',
                  dataIndex: 8
                },
                {
                  name: 'AXIS_Z',
                  key: 'vibration_severity_z',
                  dataIndex: 9
                }
              ]
            },
            {
              name: 'FIELD_ACCLERATION_ENVELOPE',
              key: 'enveloping_pk2pk',
              unit: 'gE',
              sort: 2,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'enveloping_pk2pk_x',
                  dataIndex: 13
                },
                {
                  name: 'AXIS_Y',
                  key: 'enveloping_pk2pk_y',
                  dataIndex: 14
                },
                {
                  name: 'AXIS_Z',
                  key: 'enveloping_pk2pk_z',
                  dataIndex: 15
                }
              ]
            },
            {
              name: 'FIELD_TEMPERATURE',
              key: 'temperature',
              unit: '°C',
              sort: 3,
              precision: 1,
              fields: [
                {
                  name: 'FIELD_TEMPERATURE',
                  key: 'temperature',
                  dataIndex: 0
                }
              ]
            },
            {
              name: 'FIELD_ACCELERATION_RMS',
              key: 'acceleration_rms',
              unit: 'm/s²',
              sort: 4,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'acceleration_rms_x',
                  dataIndex: 4
                },
                {
                  name: 'AXIS_Y',
                  key: 'acceleration_rms_y',
                  dataIndex: 5
                },
                {
                  name: 'AXIS_Z',
                  key: 'acceleration_rms_z',
                  dataIndex: 6
                }
              ]
            },
            {
              name: 'FIELD_ACCLERATION_PEAK',
              key: 'acceleration_peak',
              unit: 'm/s²',
              sort: 5,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'acceleration_peak_x',
                  dataIndex: 19
                },
                {
                  name: 'AXIS_Y',
                  key: 'acceleration_peak_y',
                  dataIndex: 20
                },
                {
                  name: 'AXIS_Z',
                  key: 'acceleration_peak_z',
                  dataIndex: 21
                }
              ]
            },
            {
              name: 'FIELD_DISPLACEMENT_PEAK_TO_PEAK',
              key: 'displacement_peak_difference',
              unit: 'μm',
              sort: 6,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'displacement_peak_difference_x',
                  dataIndex: 22
                },
                {
                  name: 'AXIS_Y',
                  key: 'displacement_peak_difference_y',
                  dataIndex: 23
                },
                {
                  name: 'AXIS_Z',
                  key: 'displacement_peak_difference_z',
                  dataIndex: 24
                }
              ]
            },
            {
              name: 'FIELD_DISPLACEMENT_RMS',
              key: 'displacement',
              unit: 'μm',
              sort: 7,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'displacement_x',
                  dataIndex: 10
                },
                {
                  name: 'AXIS_Y',
                  key: 'displacement_y',
                  dataIndex: 11
                },
                {
                  name: 'AXIS_Z',
                  key: 'displacement_z',
                  dataIndex: 12
                }
              ]
            },
            {
              name: 'FIELD_FREQUENCY',
              key: 'fft_frequency',
              unit: 'Hz',
              sort: 8,
              precision: 1,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'fft_frequency_x',
                  dataIndex: 61
                },
                {
                  name: 'AXIS_Y',
                  key: 'fft_frequency_y',
                  dataIndex: 62
                },
                {
                  name: 'AXIS_Z',
                  key: 'fft_frequency_z',
                  dataIndex: 63
                }
              ]
            },
            {
              name: 'FIELD_CREST_FACTOR',
              key: 'crest_factor',
              unit: '',
              sort: 9,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'crest_factor_x',
                  dataIndex: 16
                },
                {
                  name: 'AXIS_Y',
                  key: 'crest_factor_y',
                  dataIndex: 17
                },
                {
                  name: 'AXIS_Z',
                  key: 'crest_factor_z',
                  dataIndex: 18
                }
              ]
            },
            {
              name: 'FIELD_PULSE_FACTOR',
              key: 'pulse_factor',
              unit: '',
              sort: 10,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'pulse_factor_x',
                  dataIndex: 40
                },
                {
                  name: 'AXIS_Y',
                  key: 'pulse_factor_y',
                  dataIndex: 41
                },
                {
                  name: 'AXIS_Z',
                  key: 'pulse_factor_z',
                  dataIndex: 42
                }
              ]
            },
            {
              name: 'FIELD_MARGIN_FACTOR',
              key: 'margin_factor',
              unit: '',
              sort: 11,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'margin_factor_x',
                  dataIndex: 37
                },
                {
                  name: 'AXIS_Y',
                  key: 'margin_factor_y',
                  dataIndex: 38
                },
                {
                  name: 'AXIS_Z',
                  key: 'margin_factor_z',
                  dataIndex: 39
                }
              ]
            },
            {
              name: 'FIELD_KURTOSIS',
              key: 'kurtosis',
              unit: '',
              sort: 12,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'kurtosis_x',
                  dataIndex: 25
                },
                {
                  name: 'AXIS_Y',
                  key: 'kurtosis_y',
                  dataIndex: 26
                },
                {
                  name: 'AXIS_Z',
                  key: 'kurtosis_z',
                  dataIndex: 27
                }
              ]
            },
            {
              name: 'FIELD_KURTOSIS_NORM',
              key: 'kurtosis_norm',
              unit: '',
              sort: 13,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'kurtosis_norm_x',
                  dataIndex: 28
                },
                {
                  name: 'AXIS_Y',
                  key: 'kurtosis_norm_y',
                  dataIndex: 29
                },
                {
                  name: 'AXIS_Z',
                  key: 'kurtosis_norm_z',
                  dataIndex: 30
                }
              ]
            },
            {
              name: 'FIELD_SKWENESS',
              key: 'skewness',
              unit: '',
              sort: 14,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'skewness_x',
                  dataIndex: 31
                },
                {
                  name: 'AXIS_Y',
                  key: 'skewness_y',
                  dataIndex: 32
                },
                {
                  name: 'AXIS_Z',
                  key: 'skewness_z',
                  dataIndex: 33
                }
              ]
            },
            {
              name: 'FIELD_SKWENESS_NORM',
              key: 'skewness_norm',
              unit: '',
              sort: 15,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'skewness_norm_x',
                  dataIndex: 34
                },
                {
                  name: 'AXIS_Y',
                  key: 'skewness_norm_y',
                  dataIndex: 35
                },
                {
                  name: 'AXIS_Z',
                  key: 'skewness_norm_z',
                  dataIndex: 36
                }
              ]
            },
            {
              name: 'FIELD_HALF_HARMONIC',
              key: 'fft_value_0',
              unit: 'm/s²',
              sort: 16,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'fft_value_0_x',
                  dataIndex: 52
                },
                {
                  name: 'AXIS_Y',
                  key: 'fft_value_0_y',
                  dataIndex: 53
                },
                {
                  name: 'AXIS_Z',
                  key: 'fft_value_0_z',
                  dataIndex: 54
                }
              ]
            },
            {
              name: 'FIELD_FIRST_HARMONIC',
              key: 'fft_value_1',
              unit: 'm/s²',
              sort: 17,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'fft_value_1_x',
                  dataIndex: 58
                },
                {
                  name: 'AXIS_Y',
                  key: 'fft_value_1_y',
                  dataIndex: 59
                },
                {
                  name: 'AXIS_Z',
                  key: 'fft_value_1_z',
                  dataIndex: 60
                }
              ]
            },
            {
              name: 'FIELD_SECOND_HARMONIC',
              key: 'fft_value_2',
              unit: 'm/s²',
              sort: 18,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'fft_value_2_x',
                  dataIndex: 64
                },
                {
                  name: 'AXIS_Y',
                  key: 'fft_value_2_y',
                  dataIndex: 65
                },
                {
                  name: 'AXIS_Z',
                  key: 'fft_value_2_z',
                  dataIndex: 66
                }
              ]
            },
            {
              name: 'FIELD_THIRD_HARMONIC',
              key: 'fft_value_3',
              unit: 'm/s²',
              sort: 19,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'fft_value_3_x',
                  dataIndex: 70
                },
                {
                  name: 'AXIS_Y',
                  key: 'fft_value_3_y',
                  dataIndex: 71
                },
                {
                  name: 'AXIS_Z',
                  key: 'fft_value_3_z',
                  dataIndex: 72
                }
              ]
            },
            {
              name: 'FIELD_VARIANCE',
              key: 'acc_var',
              unit: '',
              sort: 20,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'acc_var_x',
                  dataIndex: 76
                },
                {
                  name: 'AXIS_Y',
                  key: 'acc_var_y',
                  dataIndex: 77
                },
                {
                  name: 'AXIS_Z',
                  key: 'acc_var_z',
                  dataIndex: 78
                }
              ]
            },
            {
              name: 'FIELD_SPECTRUM_VARIANCE',
              key: 'spectrum_variance',
              unit: '',
              sort: 21,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'spectrum_variance_x',
                  dataIndex: 43
                },
                {
                  name: 'AXIS_Y',
                  key: 'spectrum_variance_y',
                  dataIndex: 44
                },
                {
                  name: 'AXIS_Z',
                  key: 'spectrum_variance_z',
                  dataIndex: 45
                }
              ]
            },
            {
              name: 'FIELD_SPECTRUM_MEAN',
              key: 'spectrum_mean',
              unit: '',
              sort: 22,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'spectrum_mean_x',
                  dataIndex: 46
                },
                {
                  name: 'AXIS_Y',
                  key: 'spectrum_mean_y',
                  dataIndex: 47
                },
                {
                  name: 'AXIS_Z',
                  key: 'spectrum_mean_z',
                  dataIndex: 48
                }
              ]
            },
            {
              name: 'FIELD_PPECTRUM_RMS',
              key: 'spectrum_rms',
              unit: '',
              sort: 23,
              precision: 3,
              fields: [
                {
                  name: 'AXIS_X',
                  key: 'spectrum_rms_x',
                  dataIndex: 49
                },
                {
                  name: 'AXIS_Y',
                  key: 'spectrum_rms_y',
                  dataIndex: 50
                },
                {
                  name: 'AXIS_Z',
                  key: 'spectrum_rms_z',
                  dataIndex: 51
                }
              ]
            },
            {
              name: 'FIELD_INCLINATION',
              key: 'inclination',
              unit: '°',
              sort: 24,
              precision: 2,
              fields: [
                {
                  name: 'FIELD_INCLINATION',
                  key: 'inclination',
                  dataIndex: 1
                }
              ]
            },
            {
              name: 'FIELD_PITCH',
              key: 'pitch',
              unit: '°',
              sort: 25,
              precision: 2,
              fields: [
                {
                  name: 'FIELD_PITCH',
                  key: 'pitch',
                  dataIndex: 2
                }
              ]
            },
            {
              name: 'FIELD_ROLL',
              key: 'roll',
              unit: '°',
              sort: 26,
              precision: 2,
              fields: [
                {
                  name: 'FIELD_ROLL',
                  key: 'roll',
                  dataIndex: 3
                }
              ]
            }
          ],
          data: {
            timestamp: 1751935207,
            values: {
              acc_var_x: 0.00062191254,
              acc_var_y: 0.00078787765,
              acc_var_z: 0.0013429291,
              acceleration_peak_x: 0.035263598,
              acceleration_peak_y: 0.039690938,
              acceleration_peak_z: 0.05181896,
              acceleration_rms_x: 0.02493513,
              acceleration_rms_y: 0.028065732,
              acceleration_rms_z: 0.03664154,
              crest_factor_x: 3.7263353,
              crest_factor_y: 3.966311,
              crest_factor_z: 3.9476066,
              displacement_peak_difference_x: 0.8163148,
              displacement_peak_difference_y: 1.5497868,
              displacement_peak_difference_z: 2.2937024,
              displacement_x: 0.28861088,
              displacement_y: 0.5479324,
              displacement_z: 0.8109462,
              enveloping_pk2pk_x: 0.014622967,
              enveloping_pk2pk_y: 0.018514585,
              enveloping_pk2pk_z: 0.023807008,
              fft_frequency_x: null,
              fft_frequency_y: null,
              fft_frequency_z: 0,
              fft_value_0_x: 0.001164126,
              fft_value_0_y: 0.001559749,
              fft_value_0_z: 0.0021893769,
              fft_value_1_x: 0.002291308,
              fft_value_1_y: 0.0026078518,
              fft_value_1_z: 0.0037780672,
              fft_value_2_x: 0,
              fft_value_2_y: 0.0018693479,
              fft_value_2_z: 0.0023446039,
              fft_value_3_x: 0,
              fft_value_3_y: 0.0014256206,
              fft_value_3_z: 0.0021189263,
              inclination: 1.2735857,
              kurtosis_norm_x: 2.9349985,
              kurtosis_norm_y: 3.002771,
              kurtosis_norm_z: 3.0331874,
              kurtosis_x: 0.0000011346305,
              kurtosis_y: 0.0000018630636,
              kurtosis_z: 0.0000054675575,
              margin_factor_x: 5.440488,
              margin_factor_y: 5.8329177,
              margin_factor_z: 5.848534,
              pitch: 0.432549,
              pulse_factor_x: 4.64728,
              pulse_factor_y: 4.9632607,
              pulse_factor_z: 4.951556,
              roll: 0.46050382,
              skewness_norm_x: -0.03216816,
              skewness_norm_y: 0.043566022,
              skewness_norm_z: 0.05254479,
              skewness_x: -4.98725e-7,
              skewness_y: 9.631125e-7,
              skewness_z: 0.0000025849388,
              spectrum_mean_x: 0.00077462784,
              spectrum_mean_y: 0.0010104764,
              spectrum_mean_z: 0.00068746443,
              spectrum_rms_x: 0.0007792228,
              spectrum_rms_y: 0.00087705406,
              spectrum_rms_z: 0.0011450476,
              spectrum_variance_x: 1.3461366e-7,
              spectrum_variance_y: 1.6921692e-7,
              spectrum_variance_z: 2.901422e-7,
              temperature: 32.0625,
              vibration_severity_x: 0.030923344,
              vibration_severity_y: 0.043484237,
              vibration_severity_z: 0.074377924
            }
          }
        }
      ],
      properties: [
        {
          name: 'FIELD_VELOCITY_RMS',
          key: 'vibration_severity',
          unit: 'mm/s',
          sort: 1,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'vibration_severity_x',
              dataIndex: 7
            },
            {
              name: 'AXIS_Y',
              key: 'vibration_severity_y',
              dataIndex: 8
            },
            {
              name: 'AXIS_Z',
              key: 'vibration_severity_z',
              dataIndex: 9
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_ACCLERATION_ENVELOPE',
          key: 'enveloping_pk2pk',
          unit: 'gE',
          sort: 2,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'enveloping_pk2pk_x',
              dataIndex: 13
            },
            {
              name: 'AXIS_Y',
              key: 'enveloping_pk2pk_y',
              dataIndex: 14
            },
            {
              name: 'AXIS_Z',
              key: 'enveloping_pk2pk_z',
              dataIndex: 15
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_TEMPERATURE',
          key: 'temperature',
          unit: '°C',
          sort: 3,
          precision: 1,
          fields: [
            {
              name: 'FIELD_TEMPERATURE',
              key: 'temperature',
              dataIndex: 0
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_ACCELERATION_RMS',
          key: 'acceleration_rms',
          unit: 'm/s²',
          sort: 4,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'acceleration_rms_x',
              dataIndex: 4
            },
            {
              name: 'AXIS_Y',
              key: 'acceleration_rms_y',
              dataIndex: 5
            },
            {
              name: 'AXIS_Z',
              key: 'acceleration_rms_z',
              dataIndex: 6
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_ACCLERATION_PEAK',
          key: 'acceleration_peak',
          unit: 'm/s²',
          sort: 5,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'acceleration_peak_x',
              dataIndex: 19
            },
            {
              name: 'AXIS_Y',
              key: 'acceleration_peak_y',
              dataIndex: 20
            },
            {
              name: 'AXIS_Z',
              key: 'acceleration_peak_z',
              dataIndex: 21
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_DISPLACEMENT_PEAK_TO_PEAK',
          key: 'displacement_peak_difference',
          unit: 'μm',
          sort: 6,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'displacement_peak_difference_x',
              dataIndex: 22
            },
            {
              name: 'AXIS_Y',
              key: 'displacement_peak_difference_y',
              dataIndex: 23
            },
            {
              name: 'AXIS_Z',
              key: 'displacement_peak_difference_z',
              dataIndex: 24
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_DISPLACEMENT_RMS',
          key: 'displacement',
          unit: 'μm',
          sort: 7,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'displacement_x',
              dataIndex: 10
            },
            {
              name: 'AXIS_Y',
              key: 'displacement_y',
              dataIndex: 11
            },
            {
              name: 'AXIS_Z',
              key: 'displacement_z',
              dataIndex: 12
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_FREQUENCY',
          key: 'fft_frequency',
          unit: 'Hz',
          sort: 8,
          precision: 1,
          fields: [
            {
              name: 'AXIS_X',
              key: 'fft_frequency_x',
              dataIndex: 61
            },
            {
              name: 'AXIS_Y',
              key: 'fft_frequency_y',
              dataIndex: 62
            },
            {
              name: 'AXIS_Z',
              key: 'fft_frequency_z',
              dataIndex: 63
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_CREST_FACTOR',
          key: 'crest_factor',
          unit: '',
          sort: 9,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'crest_factor_x',
              dataIndex: 16
            },
            {
              name: 'AXIS_Y',
              key: 'crest_factor_y',
              dataIndex: 17
            },
            {
              name: 'AXIS_Z',
              key: 'crest_factor_z',
              dataIndex: 18
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_PULSE_FACTOR',
          key: 'pulse_factor',
          unit: '',
          sort: 10,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'pulse_factor_x',
              dataIndex: 40
            },
            {
              name: 'AXIS_Y',
              key: 'pulse_factor_y',
              dataIndex: 41
            },
            {
              name: 'AXIS_Z',
              key: 'pulse_factor_z',
              dataIndex: 42
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_MARGIN_FACTOR',
          key: 'margin_factor',
          unit: '',
          sort: 11,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'margin_factor_x',
              dataIndex: 37
            },
            {
              name: 'AXIS_Y',
              key: 'margin_factor_y',
              dataIndex: 38
            },
            {
              name: 'AXIS_Z',
              key: 'margin_factor_z',
              dataIndex: 39
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_KURTOSIS',
          key: 'kurtosis',
          unit: '',
          sort: 12,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'kurtosis_x',
              dataIndex: 25
            },
            {
              name: 'AXIS_Y',
              key: 'kurtosis_y',
              dataIndex: 26
            },
            {
              name: 'AXIS_Z',
              key: 'kurtosis_z',
              dataIndex: 27
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_KURTOSIS_NORM',
          key: 'kurtosis_norm',
          unit: '',
          sort: 13,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'kurtosis_norm_x',
              dataIndex: 28
            },
            {
              name: 'AXIS_Y',
              key: 'kurtosis_norm_y',
              dataIndex: 29
            },
            {
              name: 'AXIS_Z',
              key: 'kurtosis_norm_z',
              dataIndex: 30
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_SKWENESS',
          key: 'skewness',
          unit: '',
          sort: 14,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'skewness_x',
              dataIndex: 31
            },
            {
              name: 'AXIS_Y',
              key: 'skewness_y',
              dataIndex: 32
            },
            {
              name: 'AXIS_Z',
              key: 'skewness_z',
              dataIndex: 33
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_SKWENESS_NORM',
          key: 'skewness_norm',
          unit: '',
          sort: 15,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'skewness_norm_x',
              dataIndex: 34
            },
            {
              name: 'AXIS_Y',
              key: 'skewness_norm_y',
              dataIndex: 35
            },
            {
              name: 'AXIS_Z',
              key: 'skewness_norm_z',
              dataIndex: 36
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_HALF_HARMONIC',
          key: 'fft_value_0',
          unit: 'm/s²',
          sort: 16,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'fft_value_0_x',
              dataIndex: 52
            },
            {
              name: 'AXIS_Y',
              key: 'fft_value_0_y',
              dataIndex: 53
            },
            {
              name: 'AXIS_Z',
              key: 'fft_value_0_z',
              dataIndex: 54
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_FIRST_HARMONIC',
          key: 'fft_value_1',
          unit: 'm/s²',
          sort: 17,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'fft_value_1_x',
              dataIndex: 58
            },
            {
              name: 'AXIS_Y',
              key: 'fft_value_1_y',
              dataIndex: 59
            },
            {
              name: 'AXIS_Z',
              key: 'fft_value_1_z',
              dataIndex: 60
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_SECOND_HARMONIC',
          key: 'fft_value_2',
          unit: 'm/s²',
          sort: 18,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'fft_value_2_x',
              dataIndex: 64
            },
            {
              name: 'AXIS_Y',
              key: 'fft_value_2_y',
              dataIndex: 65
            },
            {
              name: 'AXIS_Z',
              key: 'fft_value_2_z',
              dataIndex: 66
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_THIRD_HARMONIC',
          key: 'fft_value_3',
          unit: 'm/s²',
          sort: 19,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'fft_value_3_x',
              dataIndex: 70
            },
            {
              name: 'AXIS_Y',
              key: 'fft_value_3_y',
              dataIndex: 71
            },
            {
              name: 'AXIS_Z',
              key: 'fft_value_3_z',
              dataIndex: 72
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_VARIANCE',
          key: 'acc_var',
          unit: '',
          sort: 20,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'acc_var_x',
              dataIndex: 76
            },
            {
              name: 'AXIS_Y',
              key: 'acc_var_y',
              dataIndex: 77
            },
            {
              name: 'AXIS_Z',
              key: 'acc_var_z',
              dataIndex: 78
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_SPECTRUM_VARIANCE',
          key: 'spectrum_variance',
          unit: '',
          sort: 21,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'spectrum_variance_x',
              dataIndex: 43
            },
            {
              name: 'AXIS_Y',
              key: 'spectrum_variance_y',
              dataIndex: 44
            },
            {
              name: 'AXIS_Z',
              key: 'spectrum_variance_z',
              dataIndex: 45
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_SPECTRUM_MEAN',
          key: 'spectrum_mean',
          unit: '',
          sort: 22,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'spectrum_mean_x',
              dataIndex: 46
            },
            {
              name: 'AXIS_Y',
              key: 'spectrum_mean_y',
              dataIndex: 47
            },
            {
              name: 'AXIS_Z',
              key: 'spectrum_mean_z',
              dataIndex: 48
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_PPECTRUM_RMS',
          key: 'spectrum_rms',
          unit: '',
          sort: 23,
          precision: 3,
          fields: [
            {
              name: 'AXIS_X',
              key: 'spectrum_rms_x',
              dataIndex: 49
            },
            {
              name: 'AXIS_Y',
              key: 'spectrum_rms_y',
              dataIndex: 50
            },
            {
              name: 'AXIS_Z',
              key: 'spectrum_rms_z',
              dataIndex: 51
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_INCLINATION',
          key: 'inclination',
          unit: '°',
          sort: 24,
          precision: 2,
          fields: [
            {
              name: 'FIELD_INCLINATION',
              key: 'inclination',
              dataIndex: 1
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_PITCH',
          key: 'pitch',
          unit: '°',
          sort: 25,
          precision: 2,
          fields: [
            {
              name: 'FIELD_PITCH',
              key: 'pitch',
              dataIndex: 2
            }
          ],
          isShow: true
        },
        {
          name: 'FIELD_ROLL',
          key: 'roll',
          unit: '°',
          sort: 26,
          precision: 2,
          fields: [
            {
              name: 'FIELD_ROLL',
              key: 'roll',
              dataIndex: 3
            }
          ],
          isShow: true
        }
      ],
      data: {
        timestamp: 1751935207,
        values: {
          acc_var_x: 0.00062191254,
          acc_var_y: 0.00078787765,
          acc_var_z: 0.0013429291,
          acceleration_peak_x: 0.035263598,
          acceleration_peak_y: 0.039690938,
          acceleration_peak_z: 0.05181896,
          acceleration_rms_x: 0.02493513,
          acceleration_rms_y: 0.028065732,
          acceleration_rms_z: 0.03664154,
          crest_factor_x: 3.7263353,
          crest_factor_y: 3.966311,
          crest_factor_z: 3.9476066,
          displacement_peak_difference_x: 0.8163148,
          displacement_peak_difference_y: 1.5497868,
          displacement_peak_difference_z: 2.2937024,
          displacement_x: 0.28861088,
          displacement_y: 0.5479324,
          displacement_z: 0.8109462,
          enveloping_pk2pk_x: 0.014622967,
          enveloping_pk2pk_y: 0.018514585,
          enveloping_pk2pk_z: 0.023807008,
          fft_frequency_x: null,
          fft_frequency_y: null,
          fft_frequency_z: 0,
          fft_value_0_x: 0.001164126,
          fft_value_0_y: 0.001559749,
          fft_value_0_z: 0.0021893769,
          fft_value_1_x: 0.002291308,
          fft_value_1_y: 0.0026078518,
          fft_value_1_z: 0.0037780672,
          fft_value_2_x: 0,
          fft_value_2_y: 0.0018693479,
          fft_value_2_z: 0.0023446039,
          fft_value_3_x: 0,
          fft_value_3_y: 0.0014256206,
          fft_value_3_z: 0.0021189263,
          inclination: 1.2735857,
          kurtosis_norm_x: 2.9349985,
          kurtosis_norm_y: 3.002771,
          kurtosis_norm_z: 3.0331874,
          kurtosis_x: 0.0000011346305,
          kurtosis_y: 0.0000018630636,
          kurtosis_z: 0.0000054675575,
          margin_factor_x: 5.440488,
          margin_factor_y: 5.8329177,
          margin_factor_z: 5.848534,
          pitch: 0.432549,
          pulse_factor_x: 4.64728,
          pulse_factor_y: 4.9632607,
          pulse_factor_z: 4.951556,
          roll: 0.46050382,
          skewness_norm_x: -0.03216816,
          skewness_norm_y: 0.043566022,
          skewness_norm_z: 0.05254479,
          skewness_x: -4.98725e-7,
          skewness_y: 9.631125e-7,
          skewness_z: 0.0000025849388,
          spectrum_mean_x: 0.00077462784,
          spectrum_mean_y: 0.0010104764,
          spectrum_mean_z: 0.00068746443,
          spectrum_rms_x: 0.0007792228,
          spectrum_rms_y: 0.00087705406,
          spectrum_rms_z: 0.0011450476,
          spectrum_variance_x: 1.3461366e-7,
          spectrum_variance_y: 1.6921692e-7,
          spectrum_variance_z: 2.901422e-7,
          temperature: 32.0625,
          vibration_severity_x: 0.030923344,
          vibration_severity_y: 0.043484237,
          vibration_severity_z: 0.074377924
        }
      },
      alertLevel: 0
    },
    sourceType: '',
    operation: '>=',
    level: 1,
    value: 1.1,
    threshold: 1,
    status: 2,
    acknowledged: false,
    category: 2,
    createdAt: 1744350053,
    updatedAt: 1744350653
  })
};

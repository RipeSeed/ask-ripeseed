import mongoose from 'mongoose'

const BrandSettingSchema = new mongoose.Schema(
  {
    theme: {
      logoUrl: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      colorAdjustments: {
        historyPannelBackground: {
          type: String,
          required: true,
        },
        chatBackground: {
          type: String,
          required: true,
        },
        chatUserBubble: {
          type: String,
          required: true,
        },
        chatBotBubble: {
          type: String,
          required: true,
        },
      },
    },
    fontSetting: {
      primaryFont: {
        fontSize: {
          type: Number,
          required: true,
        },
        fontFamily: {
          type: String,
          required: true,
        },
        fontWeight: {
          type: Number,
          required: true,
        },
      },
      secondaryFont: {
        fontSize: {
          type: Number,
          required: true,
        },
        fontFamily: {
          type: String,
          required: true,
        },
        fontWeight: {
          type: Number,
          required: true,
        },
      },
      chatFont: {
        fontSize: {
          type: Number,
          required: true,
        },
        fontFamily: {
          type: String,
          required: true,
        },
        fontWeight: {
          type: Number,
          required: true,
        },
      },
    },
    externalLinks: {
      linkLabel: {
        type: [String],
        required: true,
      },
      linkUrl: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
)

const BrandSetting =
  mongoose.models.BrandSetting ||
  mongoose.model('BrandSetting', BrandSettingSchema)

export default BrandSetting

import mongoose, { model, Schema } from "mongoose";

interface ISettings {
  ownerId: string;
  businessName: string;
  supportEmail: string;
  knowledge: string;
  //  new addition
  chatBubbleColor: string;
  widgetPosition: "left" | "right";
  borderRadius: number;
  botIcon: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
    },
    supportEmail: {
      type: String,
    },
    knowledge: {
      type: String,
    },

    // 🎨 Appearance settings

    chatBubbleColor: {
      type: String,
      default: "#22C55E",
    },

    widgetPosition: {
      type: String,
      enum: ["left", "right"],
      default: "right",
    },

    borderRadius: {
      type: Number,
      default: 18,
    },

    // Bot Image 
    botIcon: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Settings = mongoose.models.Settings || model("Settings", settingsSchema);
export default Settings;

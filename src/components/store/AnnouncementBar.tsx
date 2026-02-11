import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSupabaseData";

const AnnouncementBar = () => {
  const { data: settings } = useSiteSettings();
  const text = settings?.announcement_text || "شحن مجاني للطلبات فوق 200 ريال 🚚";

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="bg-charcoal text-cream text-center py-2 px-4 text-sm font-medium"
    >
      <p>{text}</p>
    </motion.div>
  );
};

export default AnnouncementBar;

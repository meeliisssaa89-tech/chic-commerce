import { motion } from "framer-motion";

const AnnouncementBar = () => {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="bg-charcoal text-cream text-center py-2 px-4 text-sm font-medium"
    >
      <p>شحن مجاني للطلبات فوق 200 ريال 🚚</p>
    </motion.div>
  );
};

export default AnnouncementBar;

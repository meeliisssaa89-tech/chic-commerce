import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-bold text-center mb-12"
      >
        تواصل معنا
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        {[
          { icon: Phone, label: "الهاتف", value: "+966 50 000 0000" },
          { icon: Mail, label: "البريد الإلكتروني", value: "info@testatoro.com" },
          { icon: MapPin, label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-6 bg-card rounded-lg"
          >
            <item.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
            <h3 className="font-bold mb-1">{item.label}</h3>
            <p className="text-muted-foreground text-sm">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;

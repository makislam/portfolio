import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/makislam' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/makislam' },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 bg-slate-900 dark:bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-muted/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
            Let's <span className="font-medium text-accent">connect</span>
          </h2>
          <p className="text-cloud-light text-lg mb-10 max-w-2xl mx-auto">
            Looking for a motivated engineer to join your team? Interested in collaborating on robotics, 
            manufacturing, or mechanical engineering projects? I'd love to hear from you.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-ivory-light text-slate-900 hover:bg-ivory rounded-full px-8 py-6 text-base font-medium group"
            >
              <a href="mailto:makis.lam@uwaterloo.ca">
                <Mail className="w-5 h-5 mr-2" />
                makis.lam@uwaterloo.ca
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-4 mt-12"
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-cloud-light hover:text-white"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

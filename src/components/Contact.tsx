import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useGallery } from './GalleryContext';
import { toast } from 'sonner';

export function Contact() {
  const { addContactSubmission } = useGallery();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to cloud storage
      await addContactSubmission({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      console.log('Form submitted:', formData);
      toast.success('Thank you for your message! I will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 tracking-wider">GET IN TOUCH</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to create something
            extraordinary.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-neutral-50 border-neutral-200 focus:border-neutral-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-neutral-50 border-neutral-200 focus:border-neutral-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="bg-neutral-50 border-neutral-200 focus:border-neutral-900 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white transition-all duration-300 transform hover:scale-[1.02]"
                size="lg"
              >
                Send Message
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => window.open('https://wa.me/917558545288?text=Hello%20I%27m%20interested%20in%20your%20services', '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                size="lg"
              >
                <MessageCircle size={20} />
                Connect to WhatsApp
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 tracking-wide">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="text-neutral-700 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Email</div>
                    <a
                      href="mailto:jagdishgavit321@gmail.com"
                      className="text-neutral-900 hover:text-neutral-600 transition-colors"
                    >
                      jagdishgavit321@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-neutral-700 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Phone</div>
                    <a
                      href="tel:+1234567890"
                      className="text-neutral-900 hover:text-neutral-600 transition-colors"
                    >
                      +91 75585 45288
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 tracking-wide">Follow Me</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/jaguuz_photography_films/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Instagram size={20} />
                </a>
                {/* <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Facebook size={20} />
                </a> */}
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-200">
              {/* <h4 className="mb-4 tracking-wide">Office Hours</h4>
              <div className="space-y-2 text-neutral-700">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>24Hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>24Hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span> 
                </div>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

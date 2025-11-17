export default function Contact() {
  return (
    <div>
      <section className="py-20">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"></textarea>
              </div>
              <button type="submit" className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition">
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">info@hotel.com</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Address</h3>
                <p className="text-gray-600 dark:text-gray-400">123 Hotel Street, City, Country</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

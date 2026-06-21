document.getElementById("contact-form").addEventListener("submit", function(e) {
      e.preventDefault();
      const nama = document.getElementById("nama").value.trim();
      const email = document.getElementById("email").value.trim();
      const pesan = document.getElementById("pesan").value.trim();

      if (!nama || !email || !pesan) {
        document.getElementById("error-msg").classList.remove("hidden");
        return;
      }

      document.getElementById("error-msg").classList.add("hidden");
      document.getElementById("success-msg").classList.remove("hidden");
      this.reset();
      setTimeout(() => document.getElementById("success-msg").classList.add("hidden"), 4000);
    });
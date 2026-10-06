export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--primary)",
        background: "var(--bg)",
        foreground: "var(--text-h)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--text-h)",
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-h)",
        },
        institution: {
          50: 'var(--bg)',               
          100: 'var(--surface-2)',       
          200: 'var(--border)',          
          300: 'var(--border-strong)',   
          400: 'var(--text)',            
          500: 'var(--text)',            
          600: 'var(--text-h)',          
          700: 'var(--text-h)',          
          800: 'var(--secondary-dark)',  /* Updated to navy */
          900: 'var(--surface-dark)',    /* Keep dark navy */
        },
        univ: {
          blue: 'var(--primary)',        
          blueHover: 'var(--primary-dark)', 
          blueLight: 'var(--primary-bg)',   
          blueBorder: 'var(--primary-glow)',
        }
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
      },
    },
  },
  plugins: [],
}

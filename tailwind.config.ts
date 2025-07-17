import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'space': ['Space Grotesk', 'sans-serif'],
				'manrope': ['Manrope', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				nova: {
					violet: 'hsl(var(--nova-violet))',
					cyan: 'hsl(var(--nova-cyan))',
					deep: 'hsl(var(--nova-deep))',
					surface: 'hsl(var(--nova-surface))'
				}
			},
			backgroundImage: {
				'cosmic': 'var(--gradient-cosmic)',
				'nova-gradient': 'var(--gradient-nova)',
				'glow-gradient': 'var(--gradient-glow)'
			},
			boxShadow: {
				'nova': 'var(--shadow-nova)',
				'cosmic': 'var(--shadow-cosmic)',
				'glow': 'var(--glow-nova)'
			},
			transitionTimingFunction: {
				'nova': 'cubic-bezier(0.4, 0, 0.2, 1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'nova-pulse': {
					'0%, 100%': { 
						opacity: '1',
						boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
					},
					'50%': { 
						opacity: '0.8',
						boxShadow: '0 0 40px hsl(var(--primary) / 0.6)'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'cosmic-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						filter: 'brightness(1) blur(0px)',
						opacity: '1'
					},
					'50%': { 
						filter: 'brightness(1.2) blur(1px)',
						opacity: '0.9'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'nova-pulse': 'nova-pulse 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'cosmic-rotate': 'cosmic-rotate 20s linear infinite',
				'glow-pulse': 'glow-pulse 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

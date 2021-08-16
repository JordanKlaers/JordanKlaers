<template>
	<div id="contact-container">
        <ul>
            <li>
                <svg viewBox="0 0 100 100" id="code-pen-logo">
                    <path stroke="white" fill="currentColor" d="M100 34.2c-.4-2.6-3.3-4-5.3-5.3-3.6-2.4-7.1-4.7-10.7-7.1-8.5-5.7-17.1-11.4-25.6-17.1-2-1.3-4-2.7-6-4-1.4-1-3.3-1-4.8 0-5.7 3.8-11.5 7.7-17.2 11.5L5.2 29C3 30.4.1 31.8 0 34.8c-.1 3.3 0 6.7 0 10v16c0 2.9-.6 6.3 2.1 8.1 6.4 4.4 12.9 8.6 19.4 12.9 8 5.3 16 10.7 24 16 2.2 1.5 4.4 3.1 7.1 1.3 2.3-1.5 4.5-3 6.8-4.5 8.9-5.9 17.8-11.9 26.7-17.8l9.9-6.6c.6-.4 1.3-.8 1.9-1.3 1.4-1 2-2.4 2-4.1V37.3c.1-1.1.2-2.1.1-3.1 0-.1 0 .2 0 0zM54.3 12.3L88 34.8 73 44.9 54.3 32.4V12.3zm-8.6 0v20L27.1 44.8 12 34.8l33.7-22.5zM8.6 42.8L19.3 50 8.6 57.2V42.8zm37.1 44.9L12 65.2l15-10.1 18.6 12.5v20.1zM50 60.2L34.8 50 50 39.8 65.2 50 50 60.2zm4.3 27.5v-20l18.6-12.5 15 10.1-33.6 22.4zm37.1-30.5L80.7 50l10.8-7.2-.1 14.4z"></path>
                </svg>
                <a href="https://codepen.io/jordanklaers" target="blank">
                    Code Pen
                </a>
            </li>
            <li>
                <svg id="linked-in-logo" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" class="global-nav__logo">
                    <g>
                        <path d="M34,2.5v29A2.5,2.5,0,0,1,31.5,34H2.5A2.5,2.5,0,0,1,0,31.5V2.5A2.5,2.5,0,0,1,2.5,0h29A2.5,2.5,0,0,1,34,2.5ZM10,13H5V29h5Zm.45-5.5A2.88,2.88,0,0,0,7.59,4.6H7.5a2.9,2.9,0,0,0,0,5.8h0a2.88,2.88,0,0,0,2.95-2.81ZM29,19.28c0-4.81-3.06-6.68-6.1-6.68a5.7,5.7,0,0,0-5.06,2.58H17.7V13H13V29h5V20.49a3.32,3.32,0,0,1,3-3.58h.19c1.59,0,2.77,1,2.77,3.52V29h5Z" fill="currentColor"></path>
                    </g>
                </svg>
                <a href="https://www.linkedin.com/in/jordan-klaers/" target="blank">Linked In</a>
            </li>
            <li>
                <img class="gb_tc" src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png" srcset="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png 1x, https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_2x_r2.png 2x " alt="" aria-hidden="true">
                email: Jordan.Klaers@gmail.com
            </li>
        </ul>
	</div>
</template>

<script>
export default {
	name: 'contact',
    data() {
        return {
        }
    },
    props: {
    },
	computed: {
	},
    mounted() {
    },
	methods: {
	}
};
</script>
<style lang='scss' type="text/scss">
#contact-container {
    position: fixed;
    left: calc(var(--bio-placement) + 2.2rem);
    top: 50vh;
    color: white;
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        li, a {
            font-size: 1.2rem;
            line-height: 1.4rem;
            text-decoration: none;
            color: var(--text-color);
        }
        li {
            margin: 0.5rem 0;
            #code-pen-logo, #linked-in-logo {
                position: absolute;
                transform: translateX(calc(-100% - 0.5rem));
                width: 1.2rem;
                height: 1.2rem;
            }
            img {
                height: 1.2rem;
                width: 3.72rem;
                position: absolute;
                transform: translateX(calc(-1.2rem - 0.5rem));
                clip-path: inset(0px 2.52rem 0px 0px);
            }
            a {
                &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>



<script>
import * as _gsap from '_gsap_';
import ScrollTrigger from '_gsap_/ScrollTrigger';
import CustomEase from '_gsap_/CustomEase';
import CSSRulePlugin from '_gsap_/CSSRulePlugin';
import CSSPlugin from '_gsap_/CSSPlugin';
export default {
	name: 'Gsap',
	data() {
        _gsap.gsap.registerPlugin(ScrollTrigger);
		_gsap.gsap.registerPlugin(CustomEase);
        _gsap.gsap.registerPlugin(CSSPlugin);
        _gsap.gsap.registerPlugin(CSSRulePlugin);
        //get just the base values and remove the nested gsap
        const gsap = {..._gsap};
        // delete gsap.gsap
        return {
            //combine the base values and the nested gsap values into a single object
            _gsap: { ...gsap, ..._gsap.gsap },
            _scrollTrigger: ScrollTrigger,
            _customEase: CustomEase,
            _cssRulePlugin: CSSRulePlugin
        }
    }
};
</script>
# vue-touch-slider

- touch slider plugin for Vue.js
- vue-touch-slider是一个移动端的图片滑动浏览器Vue.js插件，可以放大图片并且左右滑动浏览

![vueTouchSlider](https://github.com/oct16/vue-touch-slider/blob/master/vueTouchSlider.gif)

## Install

      npm install vue-touch-slider
      Vue.use(VueTouchSlider)
      
## Usage
#### Available through npm as `vue-touch-slider`.
  
      import vueTouchSlider from 'vue-touch-slider'  
      Vue.use(VueTouchSlider)

#### Setting your data model
  
    <script>
    	export default {
        	data(){
            	return {
                	content : '<p><img src="..."></p>'
            	}
        	}
    	}    
    </script>
    
or

    <script>
    	export default {
        	data(){
            	return {
                	content : ''
            	}
        	},
        	ready(){
        		this.$http.get('/api/...').then((res)=>{
        			return res.data
        		}).then((data)=>{
        			this.content = data.content
        		})
        	
        	}
    	}    
    </script>
        
    

#### Using the `v-touch-slider` directive bindding data
    
    <template>
        <div>
        	<div v-touch-slider="content" v-html="content"></div>
        </div>
    </template>	

## License

MIT

const main = {
    data() {
        return {
            name: '',
            firstLetter: '',
            nameList: [],
            currentPage: 1,
            isMobile: false,
            showFooter: true
        }
    },
    mounted() {
        // test if is mobile      
        if (screen.width < 576) {
            this.isMobile = true;
            this.showFooter = false;
        }

        // create a listener for scroll
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        cancelEnter( event ){
            event.preventDefault();            
            return;
        },

        // test first letter to use api
        testFirstLetter( event ) {
            // change to mayus, & no accents
            this.name = ( 
                (event.target.value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            ).toUpperCase();

            // change currentPage to 1
            this.currentPage = 1;

            if( (event.target.value).charAt(0) !== '' ){
                if( this.firstLetter !== (event.target.value).charAt(0) ) {  
                    this.firstLetter = (event.target.value).charAt(0) 
                    this.getNames();
                }
            } 

            let top = (this.$refs.table).offsetTop;
            setTimeout(function(){ window.scrollTo(0, top - 250); }, 750);
            
        },

        async getNames(){
            const res = await fetch(`https://constanciasdmundialdelcorazon.com.mx/heart/diplomas/${this.firstLetter}`);
            // if api response is ok 
            if( res.status === 200 ){
                const resData = await res.json();                
                // console.log( resData );            
                this.nameList = resData.data;                                
            } else {
                M.toast({html: 'Ocurrió un error, intentalo mas tarde!'});
            }
        },

        changeCurrentPage( page ) {
            this.currentPage = page;
        },

        customIndex( index ){
            return (index-1) + ( 10 * (this.currentPage - 1) )
        },

        handleScroll: function(){
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
                if(this.isMobile){
                    this.showFooter= true;
                }
            } else {
                if(this.isMobile){
                    this.showFooter= false;
                }
            }
        }
    },
    computed: {
        filteredNames: function(){      
            let newArray = (this.nameList).filter((elm) => {
                if( (elm.name).includes(this.name) ) {
                    return elm.name
                }
            });

            return newArray.map((elm) => {
                return elm.name;
            });
        },

        noPages: function(){
            return  ( Math.ceil( (this.filteredNames).length / 10 ) ) ;
        },
    }
}

var mountedApp = Vue.createApp( main ).mount('#app');
if (typeof(Edina) == "undefined"){  
	var Edina = {};
} ; 

createClass = function() {
	
	var Class = function() {
		this.initialize.apply(this, arguments);
	};
	Class.prototype = arguments[0];
	return Class;
};

//**************** Edina.MathUtil ************************	

Edina.MathUtil = {};
	
Edina.MathUtil.toRadians = function(val){
	var pi = Math.PI;
	return eval(val * (pi/180) );
};

Edina.MathUtil.toDegrees = function(val){
	var pi = Math.PI;
	return eval( val * (180/pi) );
};

Edina.MathUtil.sec = function(angle_radians){
	return eval ( 1.0 / Math.cos( angle_radians ) );
};

//**************** Edina.Elipsoid ************************

Edina.Elipsoid = createClass({

    /** 
    * the semi-major ellipsoid axis length(metres)
    */
	a: 0.0,
   
   /** 
    * the semi-minor ellipsoid axis length(metres)
    */
    b: 0,
   
    /**
     * Constructor: Edina.Elipsoid 
     * 
     * a - {Number} the semi-major ellipsoid axis length(metres)
     * b - {Number} the semi-minor ellipsoid axis length(metres)
     */
     initialize: function(a, b){
    	 this.a  = a;
		 this.b = b ;  
     },

     convertCartesianToLatLongHeight : function( x, y, z ){
		
    	 var phi;
    	 var lamda;
    	 var height;
    	 var latLong = new Array(3);
  
    	 var lamda = Math.atan( y / x );
  
    	 var phi = Math.atan( z / ( this.p( x, y ) * ( 1 - this.eSq() ) ) );
    	 var previousPhi = 0.0;
    	 while ( Math.abs( phi - previousPhi ) > 0.0000000000000001 ) {
    		 previousPhi = phi;
    		 phi = Math.atan( ( z + this.eSq() * this.v( previousPhi ) * Math.sin( previousPhi ) ) / this.p( x, y ) );
    	 }
  
    	 height = ( this.p( x, y ) / Math.cos( phi ) ) - this.v( phi );
  
    	 latLong[0] = Edina.MathUtil.toDegrees( phi );
    	 latLong[1] = Edina.MathUtil.toDegrees( lamda );
    	 latLong[2] = height;
  
    	 return latLong;
	 
     },

     v: function(latitude) {
		   return this.a / Math.sqrt( 1 - ( this.eSq() * Math.pow( Math.sin( latitude ), 2.0 ) ) );
     },
     
     p: function(x, y) {
    	 return Math.sqrt( Math.pow( x, 2.0 ) + Math.pow( y, 2.0 ) );
	 },
	 
	 eSq: function(){
		  var aSq = Math.pow( this.a, 2.0 );
		  return ( aSq - Math.pow( this.b, 2.0 ) ) / aSq;
	 },
	   
	 convertLatLongToCartesian : function(lat, lon){
		 return this.convertLatLongHeightToCartesian( lat, lon, 0.0 );
	 },

	 convertLatLongHeightToCartesian : function( lat, lon, height ) {

		 var phi = Edina.MathUtil.toRadians( lat );
		 var lamda = Edina.MathUtil.toRadians( lon );
	   
	     var vAndHeight = this.v( phi ) + height;
	     var cartesian = new Array(3);	
	     cartesian[0] = vAndHeight * Math.cos( phi ) * Math.cos( lamda );
	     cartesian[1] = vAndHeight * Math.cos( phi ) * Math.sin( lamda );
	     cartesian[2] = ( ( ( 1 - this.eSq() ) * this.v( phi ) ) + height ) * Math.sin( phi );
	     
	     return cartesian;
	 },
		
	 CLASS_NAME: "Edina.Elipsoid"	

});


//**************** Edina.TransverseMercator ************************

Edina.TransverseMercator = createClass({
	
	/** 
	 *  semi-major ellipsoid axis (metres)
	 */
	a: 6377563.396,
	
	/** 
	 *  semi-minor ellipsoid axis (metres)
	 */
	b: 6356256.910,
	
	/** 
	 *  Northing of true origin 
	 */
	N0: -100000.0,
	
	/** 
	 *  Easting of true origin
	 */
	E0: 400000.0,
	
	/** 
	 *  Scale factor on actual meridian
	 */
	F0: 0.9996012717,
	
	/** 
	 * Latitude of true origin
	 */
	phi_0: Edina.MathUtil.toRadians( 49.0 ),
	
	/** 
	 * Longitude of true origin and central meridian
	 */
	lamda_0: Edina.MathUtil.toRadians( -2.0 ),
	
    /**
    * Constructor: Edina.Geo.TransverseMercator
    * Create a new map location.
    *
    */
   initialize: function() {
   },

   calcNu : function( e_sq,  phi ) {
	   return this.a * this.F0 * Math.pow( ( 1.0 - ( e_sq * Math.pow( Math.sin( phi ), 2.0 ) ) ), -0.5 );
   },
	
   calcN : function() {	
	   return ( this.a - this.b ) / ( this.a + this.b );
   },

   calcRho: function( e_sq, phi ) {
	   return this.a * this.F0 * ( 1.0 - e_sq ) * Math.pow( ( 1.0 - ( e_sq * Math.pow( Math.sin( phi ), 2.0 ) ) ), -1.5 );
   },
		
   calcEtaSq : function( nu, rho ) {
	   return ( nu / rho ) - 1.0;
   },

   calcM : function( n, phi_prime ) {
		var part_1;
		var part_2;
		var part_3;
		var part_4;
		
		part_1 = ( 1.0 + n + ((5.0/4.0) * (n*n)) + ((5.0/4.0) * (n*n*n)) ) * ( phi_prime - this.phi_0 );
		part_2 = ( (3.0*n) + (3.0 * (n*n)) + ((21.0/8.0) * (n*n*n))) * Math.sin( phi_prime - this.phi_0 ) * Math.cos( phi_prime + this.phi_0 );
		
		part_3 = (((15.0/8.0) * (n*n)) + ((15.0/8.0) * (n*n*n) )) * Math.sin( 2.0*( phi_prime - this.phi_0 ) ) * Math.cos( 2.0*( phi_prime + this.phi_0 ) );
		
		part_4 = (35.0/24.0) * (n*n*n) * Math.sin( 3.0*( phi_prime - this.phi_0 ) ) * Math.cos( 3.0*( phi_prime + this.phi_0 ) );
		
		return this.b * this.F0 * ( part_1 - part_2 + part_3 - part_4 );
	},
	
	setIrishGrid : function() {
		this.a = 6377340.189;
		this.b = 6356034.447;
		this.N0 = 250000.0;
		this.E0 = 200000.0;
		this.F0 = 1.000035;
		this.phi_0 = Edina.MathUtil.toRadians( 53.5 );
		this.lamda_0 = Edina.MathUtil.toRadians( -8.0 );
	},
	
	setEllipsoid : function( a, b, northing_origin, easting_origin, scale_factor, lat_origin, long_origin ) {
		this.a = a;
		this.b = b;
		this.N0 = northing_origin;
		this.E0 = easting_origin;
		this.F0 = scale_factor;
		this.phi_0 = Edina.MathUtil.toRadians( lat_origin );
		this.lamda_0 = Edina.MathUtil.toRadians( long_origin );
	},

	getCoordFromLatLong : function( latitude, longitude ) {
		var a_sq = this.a * this.a;
		var b_sq = this.b * this.b;
		var e_sq = ( a_sq - b_sq ) / a_sq;
		var phi = Edina.MathUtil.toRadians( latitude );
		var lamda = Edina.MathUtil.toRadians( longitude );
		var n;
		var M;
		var nu;
		var rho;
		var eta_sq;
		var I;
		var II;
		var III;
		var IIIA;
		var IV;
		var V;
		var VI;
		var N;		//northings
		var E;		//eastings
		
		n = this.calcN();
		nu = this.calcNu( e_sq, phi );
		rho = this.calcRho( e_sq, phi );
		eta_sq = this.calcEtaSq( nu, rho );
		M = this.calcM( n, phi );
		
		I = M + this.N0;
		
		II = (nu/2.0) * Math.sin( phi ) * Math.cos( phi );
		
		III = (nu/24.0) * Math.sin( phi ) * Math.pow( Math.cos( phi ), 3.0 ) * ( 5.0 - Math.pow( Math.tan( phi ), 2.0 ) + (9.0 * eta_sq) );
		
		IIIA = (nu/720.0) * Math.sin( phi ) * Math.pow( Math.cos( phi ), 5.0 ) * ( 61.0 - (58.0 * Math.pow( Math.tan( phi ), 2.0 )) + Math.pow( Math.tan( phi ), 4.0 ) );
		
		IV = nu * Math.cos( phi );
		
		V = (nu/6.0) * Math.pow( Math.cos( phi ), 3.0 ) * ( (nu/rho) - Math.pow( Math.tan( phi ), 2.0 ) );
		
		VI = (nu/120.0) * Math.pow( Math.cos( phi ), 5.0 ) * ( 5.0 - (18.0 * Math.pow( Math.tan( phi ), 2.0 )) + Math.pow( Math.tan( phi ), 4.0 ) + (14.0 * eta_sq) - (58.0 * Math.pow( Math.tan( phi ), 2.0 ) * eta_sq) );
		
		N = I + (II * Math.pow( lamda - this.lamda_0, 2.0 )) + (III * Math.pow( lamda - this.lamda_0, 4.0 )) + (IIIA * Math.pow( lamda - this.lamda_0, 6.0 ));
		E = this.E0 + (IV * ( lamda - this.lamda_0 )) + (V * Math.pow( lamda - this.lamda_0, 3.0 )) + (VI * Math.pow( lamda - this.lamda_0, 5.0 ));
		var answer = new Array(2);
		answer[0] = N;
		answer[1] = E;
		return answer;
	},

	getLatLongFromCoord : function( northing, easting ) {
		var a_sq = this.a * this.a;
		var b_sq = this.b * this.b;
		var e_sq = ( a_sq - b_sq ) / a_sq;
		var phi_prime;
		var phi_new;
		var n;
		var M;
		var nu;
		var rho;
		var eta_sq;
		var VII;
		var VIII;
		var IX;
		var X;
		var XI;
		var XII;
		var XIIA;
		var phi;		//degrees north
		var lamda;	//degrees east
		
		phi_prime = ( ( northing - this.N0 ) / ( this.a * this.F0 ) ) + this.phi_0;
		n = this.calcN();
		M = this.calcM( n, phi_prime );
        
		while ( Math.abs(northing - this.N0 - M) >= (0.01/1000.0) ) {
			phi_new = ( ( northing - this.N0 - M ) / ( this.a * this.F0 ) ) + phi_prime;
			M = this.calcM( n, phi_new );
			phi_prime = phi_new;
		}
		
		nu = this.calcNu( e_sq, phi_prime );
		rho = this.calcRho( e_sq, phi_prime );
		eta_sq = this.calcEtaSq( nu, rho );
		
		VII = Math.tan( phi_prime ) / ( 2.0 * rho * nu );
		
		VIII = (Math.tan( phi_prime ) / ( 24.0 * rho * (nu*nu*nu) ))
			* 	( 5.0 + (3.0 * Math.pow( Math.tan( phi_prime ), 2.0 )) + eta_sq
			-	(9.0 * Math.pow( Math.tan( phi_prime ), 2.0 ) * eta_sq) );
		
		IX = ( Math.tan( phi_prime ) / (720.0 * rho * Math.pow( nu, 5.0 )) )
			*	( 61.0 + (90.0 * Math.pow( Math.tan( phi_prime ), 2.0 ))
			+	(45.0 * Math.pow( Math.tan( phi_prime ), 4.0 )) );
		
		X = Edina.MathUtil.sec( phi_prime ) / nu;
		
		XI = (Edina.MathUtil.sec( phi_prime ) / (6.0 * (nu*nu*nu)))
			*	( (nu/rho) + (2.0 * Math.pow( Math.tan( phi_prime ), 2.0 )) );
		
		XII = (Edina.MathUtil.sec( phi_prime ) / (120.0 * Math.pow( nu, 5.0 )))
			*	( 5.0 + (28.0 * Math.pow( Math.tan( phi_prime ), 2.0 ))
			+	(24.0 * Math.pow( Math.tan( phi_prime ), 4.0 )) );
		
		XIIA = (Edina.MathUtil.sec( phi_prime ) / (5040.0 * Math.pow( nu, 7.0 ) ))
			*	( 61.0 + (662.0 * Math.pow( Math.tan( phi_prime ), 2.0 ))
			+	(1320.0 * Math.pow( Math.tan( phi_prime ), 4.0 ))
			+	(720.0 * Math.pow( Math.tan( phi_prime ), 6.0 )) );
		
		phi = phi_prime - (VII * Math.pow( easting-this.E0, 2.0 )) + (VIII * Math.pow( easting- this.E0, 4.0 )) - (IX * Math.pow( easting- this.E0, 6.0 ));
		lamda = this.lamda_0 + (X * (easting- this.E0)) - (XI * Math.pow( easting- this.E0, 3.0 )) + (XII * Math.pow( easting- this.E0, 5.0 )) - (XIIA * Math.pow( easting- this.E0, 7.0 ));
		var answer = new Array(2);
		answer[0] = Edina.MathUtil.toDegrees( phi );
		answer[1] = Edina.MathUtil.toDegrees( lamda );
		return answer;
	},

    CLASS_NAME: "Edina.TransverseMercator"
});

//************************ Edina.HelmertTransformation ********************************

Edina.HelmertTransformation = createClass({
	
    tX: 0,
    tY: 0,
    tZ: 0,
    rX: 0,
    rY: 0,
    rZ: 0,
    scale: 0,
    
    /**
    * Constructor: Edina.HelmertTransformation 
    * 
    */

	initialize:  function  (tX, tY, tZ, rX, rY, rZ, scale ){

	    this.tX = tX;
	    this.tY = tY;
	    this.tZ = tZ;
	    this.rX = Edina.MathUtil.toRadians( rX / 3600 );
	    this.rY = Edina.MathUtil.toRadians( rY / 3600 );
	    this.rZ = Edina.MathUtil.toRadians( rZ / 3600 );
	    this.scale = scale * 0.000001;
	},

	helmertTransform : function( x, y, z, tX, tY, tZ, rX, rY, rZ, scale )  {
		var coord = new Array(3);
    
		var sPlus1 = 1 + scale;
		var newX = (sPlus1 * x) - (rZ * y) + (rY * z);
		var newY = (rZ * x) + (sPlus1 * y) - (rX * z);
		var newZ = (-rY * x) + (rX * y) + (sPlus1 * z);

		coord[0] = newX + tX;
		coord[1] = newY + tY;
		coord[2] = newZ + tZ;

		return coord;
	},
	performHelmertTransformation : function( x,  y,  z )  {
		return this.helmertTransform( x, y, z, this.tX, this.tY, this.tZ, this.rX, this.rY, this.rZ, this.scale );
	},

	reverseHelmertTransformation : function( x, y, z )  {
		return this.helmertTransform( x, y, z, -this.tX, -this.tY, -this.tZ, -this.rX, -this.rY, -this.rZ, -this.scale );
	},

	performHelmertTransformation : function( x,  y,  z )  {
		return this.helmertTransform( x, y, z, this.tX, this.tY, this.tZ, this.rX, this.rY, this.rZ, this.scale );
	},

	reverseHelmertTransformation : function( x, y, z )  {
		return this.helmertTransform( x, y, z, -this.tX, -this.tY, -this.tZ, -this.rX, -this.rY, -this.rZ, -this.scale );
	},

	CLASS_NAME: "Edina.HelmertTransformation"

});

//*************************** Edina.EPSG_27700 **************************

Edina.EPSG_27700 = createClass({

	osgb36 : new Edina.Elipsoid( 6377563.396, 6356256.910 ),
	wgs84 : new Edina.Elipsoid( 6378137.000, 6356752.3141 ),
	toWgs84 :  new Edina.HelmertTransformation( 446.448, -125.157, 542.060,
                                               0.1502, 0.2470, 0.8421,
                                               -20.4894 ),
    
   coord : new Edina.TransverseMercator(),

   initialize : function (){},
   
   toLocalSystem : function(lat, lon) {
	  var cartesian = this.wgs84.convertLatLongToCartesian( lat, lon );
	  var newCartesian = this.toWgs84.reverseHelmertTransformation( cartesian[0],
                                                                  cartesian[1],
                                                                  cartesian[2] );
	  var latlong = this.osgb36.convertCartesianToLatLongHeight( newCartesian[0],
                                                               newCartesian[1],
                                                               newCartesian[2] );
	  return this.fromLatLong( latlong[0], latlong[1] );

   },

   toLatLong : function(northing, easting) {
	   return   this.coord.getLatLongFromCoord(northing, easting);
   },
  
   fromLatLong : function(lat, lon) {
	   return this.coord.getCoordFromLatLong(lat, lon);
   },
   
   CLASS_NAME: "Edina.EPSG_27700"

});













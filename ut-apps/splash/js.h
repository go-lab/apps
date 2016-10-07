/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

#define assert(x) { console.log(__FILE__ + ': ' + __LINE__ + x);	\
    if (!(x)) printf('*** Assert failed for ' + x); \
    printf('assert done '); }

#define pboth(Class, Var) Class.prototype.Var = function(v0) { \
    if (v0 === undefined) \
      return this._ ## Var; \
    this._ ## Var = v0; \
    return this; \
}

#define pread(Class, Var) Class.prototype.Var = function() { \
    return this._ ## Var; \
}

#define pwrite(Class, Var) Class.prototype.Var = function(v0) { \
    this._ ## Var; \
    return this; \
}

#define mboth(Class, Var) Class.Var = function(v0) {	\
    if (v0 === undefined) \
      return this._ ## Var; \
    this._ ## Var = v0; \
    return this; \
}

#define mread(Class, Var) Class.Var = function() { \
    return this._ ## Var; \
}

#define mwrite(Class, Var) Class.Var = function(v0) { \
    this._ ## Var; \
    return this; \
}

#define forall(Var, Array, Value) for (var Value, Var=0; Var<Array.length, Value=Array[Var]; Var++)



function printf(str) {
    if (console && console.log)
        console.log(str);
    else
        print(str);
}

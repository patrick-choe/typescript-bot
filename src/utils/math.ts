const betterEval = (content: String) => {
    return content
        .split(/sqrtpi|루트파이/gi).join('루트(파이)')
        .split(/sqrt\(|루트\(/gi).join('Math.sqrt(')
        .split(/abs\(|절댓값\(/gi).join('Math.abs(')
        .split(/round\(|반올림\(/gi).join('Math.round(')
        .split(/floor\(|내림\(/gi).join('Math.floor(')
        .split(/ceil\(|올림\(/gi).join('Math.ceil(')
        .split(/cos\(|코사인\(/gi).join('Math.cos(')
        .split(/sin\(|사인\(/gi).join('Math.sin(')
        .split(/tan\(|탄젠트\(/gi).join('Math.tan(')
        .split(/log\(|ln\(|로그\(|로그e\(|자연로그\(/gi).join('Math.log(')
        .split(/log10\(|로그10\(/gi).join('Math.log10(')
        .split(/log2\(|로그2\(/gi).join('Math.log2(')
        .split(/rand|random|랜덤/gi).join('Math.random()')
        .split(/PI|파이/gi).join('Math.PI')
        .split(/MathE|자연상수|자연로그밑/gi).join('Math.E');
}



export { betterEval };
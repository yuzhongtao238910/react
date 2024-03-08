const obj1 = {
	age1: "1"
}

const obj2 = {
	age2: "2"
}

Object.setPrototypeOf(obj2, obj1)


for (let key in obj2) {
	console.log(key)
}


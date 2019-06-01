export const Key_Board = class Key_Board { 
    constructor() { 
        this.sounds = [];
    }

    handleKey(e) {
        console.log(e.keyCode);
        switch(e.keyCode) { 
            // for each keyCode play a different sound + override material etc.

        }
    }
}

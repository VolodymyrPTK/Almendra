<template>
    <div>
        <button popovertarget="foo">Toggle the popover</button>
        <div id="foo" popover>Popover content</div>

        <form>
            <fieldset>
                <legend>Details</legend>
                Student Name: <input type="text"><br />
                MCA Subjects:<input type="text"><br />
                Course Link:<input type="url" name="websitelink">
            </fieldset>
        </form>

        <form action="/action_page.php" method="get">
            <label for="browser">Choose your browser from the list:</label>
            <input placeholder="select" list="browsers" name="browser" id="browser">
            <datalist id="browsers">
                <option value="Edge"></option>
                <option value="Firefox"></option>
                <option value="Chrome"></option>
                <option value="Opera"></option>
                <option value="Safari"></option>
            </datalist>
            <input type="submit">
        </form>

    </div>
</template>

<script>

</script>

<style>
fieldset {
    border: none;
    box-shadow: 0 5px 5px grey;
    margin: 10px;
    background-color: bisque;
    border-radius: 25px;
}

legend {
    border: none;
    border-radius: 25px;
    margin: 10px;
    background-color: bisque;
    padding: 10px;
}
</style>

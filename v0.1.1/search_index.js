var documenterSearchIndex = {"docs":
[{"location":"api/","page":"API","title":"API","text":"CurrentModule = ImGuiTestEngine\nCollapsedDocStrings = true","category":"page"},{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"note: Note\nWe try to document the basics here, but it is not meant as a replacement for the upstream documentation. If you need general help we recommend looking at the test engine wiki, and possibly at the documentation comments in these header files:imgui_te_engine.h (for the engine API)\nimgui_te_context.h (for the test context API)","category":"page"},{"location":"api/","page":"API","title":"API","text":"There are two major parts of the test engine:","category":"page"},{"location":"api/","page":"API","title":"API","text":"The Engine itself. This is the class that executes the tests and handles things like interacting with the GUI.\nThe TestContext API, which is what you'll use to control the GUI and write the tests.","category":"page"},{"location":"api/","page":"API","title":"API","text":"danger: Danger\nFor the sake of simplicitly certain parts of the API are not memory-safe. This means that some test engine types are wrapped as raw pointers that are owned by C++ rather than Julia, which means that using them after they have been free'd will cause segfaults. All memory-unsafe types are marked as such in their docstrings.Because of all that, we recommend using such types only temporarily in the style recommended by the upstream examples. This style is good:# The test object is never even assigned to a variable\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ...\nendThis style is less good:all_tests = []\nt = @register_test(engine, \"foo\", \"bar\")\nt.TestFunc = ...\n\n# Dangerous because it allows `t` to potentially be accessed after the\n# engine has been destroyed.\npush!(all_tests, t)","category":"page"},{"location":"api/","page":"API","title":"API","text":"Note that in all the examples in the docstrings below we assume that we have already evaluated:","category":"page"},{"location":"api/","page":"API","title":"API","text":"import CImGui as ig\nusing ImGuiTestEngine\nimport ImGuiTestEngine as te","category":"page"},{"location":"api/","page":"API","title":"API","text":"Pages = [\"api.md\"]\nDepth = 3","category":"page"},{"location":"api/","page":"API","title":"API","text":"","category":"page"},{"location":"api/#Engine","page":"API","title":"Engine","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Engine\nCreateContext\nDestroyContext\nStart\nStop\nTestGroup\nTestRunFlags\nQueueTest\nQueueTests\nShowTestEngineWindows\nBase.isassigned(::Engine)","category":"page"},{"location":"api/#ImGuiTestEngine.Engine","page":"API","title":"ImGuiTestEngine.Engine","text":"mutable struct Engine\n\nRepresents a test engine context. This a wrapper around the upstream ImGuiTestEngine type. Don't create it yourself, use CreateContext().\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.CreateContext","page":"API","title":"ImGuiTestEngine.CreateContext","text":"CreateContext(\n;\n    exit_on_completion,\n    show_test_window\n) -> ImGuiTestEngine.Engine\n\n\nCreate a test engine context. The keyword arguments don't do anything in this library, they're used to support the test engine in CImGui.jl's renderloop.\n\nArguments\n\nexit_on_completion=true: Exit the program after the tests have completed.\nshow_test_window=true: Call ShowTestEngineWindows() while running the tests.\n\nExamples\n\nengine = te.CreateContext()\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.DestroyContext","page":"API","title":"ImGuiTestEngine.DestroyContext","text":"DestroyContext(engine::ImGuiTestEngine.Engine; throw)\n\n\nDestroy a test engine context.\n\nArguments\n\nthrow=true: Whether to throw an exception if the engine has already been destroyed.\n\nExamples\n\nengine = te.CreateContext()\nte.DestroyContext(engine)\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.Start","page":"API","title":"ImGuiTestEngine.Start","text":"Start(\n    engine::ImGuiTestEngine.Engine,\n    ctx::Ptr{CImGui.lib.ImGuiContext}\n)\n\n\nStart a test engine context. If you're using CImGui.jl's renderloop you must not call this, it will be called automatically for you.\n\nExamples\n\nctx = ig.CreateContext()\nengine = te.CreateContext()\nte.Start(engine, ctx)\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.Stop","page":"API","title":"ImGuiTestEngine.Stop","text":"Stop(engine::ImGuiTestEngine.Engine)\n\n\nStop a test engine context.\n\nExamples\n\nctx = ig.CreateContext()\nengine = te.CreateContext()\nte.Start(engine, ctx)\nte.Stop(engine)\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.TestGroup","page":"API","title":"ImGuiTestEngine.TestGroup","text":"primitive type TestGroup <: Enum{Int32} 32\n\nWrapper for the upstream ImGuiTestGroup enum. Possible values:\n\nTestGroup_Perfs\nTestGroup_Tests\nTestGroup_Unknown\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.TestRunFlags","page":"API","title":"ImGuiTestEngine.TestRunFlags","text":"primitive type TestRunFlags <: Enum{Int32} 32\n\nWrapper for the upstream ImGuiTestRunFlags enum. Possible values:\n\nTestRunFlags_None\nTestRunFlags_GuiFuncDisable\nTestRunFlags_GuiFuncOnly\nTestRunFlags_NoSuccessMsg\nTestRunFlags_EnableRawInputs\nTestRunFlags_RunFromGui\nTestRunFlags_RunFromCommandLine\nTestRunFlags_NoError\nTestRunFlags_ShareVars\nTestRunFlags_ShareTestContext\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.QueueTest","page":"API","title":"ImGuiTestEngine.QueueTest","text":"QueueTest(\n    engine::ImGuiTestEngine.Engine,\n    test::ImGuiTestEngine.ImGuiTest\n)\nQueueTest(\n    engine::ImGuiTestEngine.Engine,\n    test::ImGuiTestEngine.ImGuiTest,\n    run_flags\n)\n\n\nQueue a specific test for execution. If you're using the CImGui.jl renderloop it shouldn't be necessary to call this yourself.\n\nExamples\n\nengine = te.CreateContext()\nt = @register_test(engine, \"foo\", \"bar\") do ctx\n    @info \"Hello world!\"\nend\n\nte.QueueTest(engine, t)\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.QueueTests","page":"API","title":"ImGuiTestEngine.QueueTests","text":"QueueTests(engine::ImGuiTestEngine.Engine)\nQueueTests(\n    engine::ImGuiTestEngine.Engine,\n    group::ImGuiTestEngine.TestGroup\n)\nQueueTests(\n    engine::ImGuiTestEngine.Engine,\n    group::ImGuiTestEngine.TestGroup,\n    filter\n)\nQueueTests(\n    engine::ImGuiTestEngine.Engine,\n    group::ImGuiTestEngine.TestGroup,\n    filter,\n    run_flags\n)\n\n\nQueue all tests in a specific group. If you're using the CImGui.jl renderloop it shouldn't be necessary to call this yourself.\n\nExamples\n\nengine = te.CreateContext()\nt = @register_test(engine, \"foo\", \"bar\") do ctx\n    @info \"Hello world!\"\nend\n\n# Queue all tests\nte.QueueTests(engine)\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ShowTestEngineWindows","page":"API","title":"ImGuiTestEngine.ShowTestEngineWindows","text":"ShowTestEngineWindows(engine::ImGuiTestEngine.Engine)\n\n\nThe main test engine window, which lets you run the tests individually. It needs to be called within the render loop.\n\nExamples\n\nctx = ig.CreateContext()\nengine = te.CreateContext()\nte.Start(engine, ctx)\n\n# This is the important bit\nig.render(ctx) do\n    te.ShowTestEngineWindows(engine)\nend\n\nte.Stop(engine)\nte.DestroyContext(engine)\n\n\n\n\n\n","category":"function"},{"location":"api/#Base.isassigned-Tuple{ImGuiTestEngine.Engine}","page":"API","title":"Base.isassigned","text":"isassigned(engine::ImGuiTestEngine.Engine) -> Bool\n\n\nCheck if the Engine has a valid pointer to a test engine context.\n\n\n\n\n\n","category":"method"},{"location":"api/#EngineIO","page":"API","title":"EngineIO","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Some engine settings can be configured with EngineIO:","category":"page"},{"location":"api/","page":"API","title":"API","text":"EngineIO\nGetIO\nTestVerboseLevel\nRunSpeed","category":"page"},{"location":"api/#ImGuiTestEngine.EngineIO","page":"API","title":"ImGuiTestEngine.EngineIO","text":"struct CxxRef{ImGuiTestEngine.lib.ImGuiTestEngineIO} <: CxxWrap.CxxWrapCore.CxxBaseRef{ImGuiTestEngine.lib.ImGuiTestEngineIO}\n\nA wee typedef for ImGuiTestEngineIO. Get this from an Engine with GetIO().\n\nSupported properties:\n\nConfigSavedSettings::Bool\nConfigRunSpeed::RunSpeed\nConfigStopOnError::Bool\nConfigKeepGuiFunc::Bool\nConfigVerboseLevel::TestVerboseLevel\nConfigVerboseLevelOnError::TestVerboseLevel\nConfigRestoreFocusAfterTests::Bool\nConfigCaptureEnabled::Bool\nConfigCaptureOnError::Bool\nConfigNoThrottle::Bool\nConfigMouseDrawCursor::Bool\nIsRunningTests::Bool (readonly)\n\ndanger: Danger\nThis a memory-unsafe type, only use it while the engine is alive.\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.GetIO","page":"API","title":"ImGuiTestEngine.GetIO","text":"GetIO(\n    engine::ImGuiTestEngine.Engine\n) -> CxxWrap.CxxWrapCore.CxxRef{ImGuiTestEngine.lib.ImGuiTestEngineIO}\n\n\nGet the EngineIO object for an engine.\n\nExamples\n\nengine = te.CreateContext()\nengine_io = te.GetIO(engine)\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.TestVerboseLevel","page":"API","title":"ImGuiTestEngine.TestVerboseLevel","text":"primitive type TestVerboseLevel <: Enum{Int32} 32\n\nWrapper around the upstream ImGuiTestVerboseLevel. Possible values:\n\nTestVerboseLevel_Silent\nTestVerboseLevel_Error\nTestVerboseLevel_Warning\nTestVerboseLevel_Info\nTestVerboseLevel_Debug\nTestVerboseLevel_Trace\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.RunSpeed","page":"API","title":"ImGuiTestEngine.RunSpeed","text":"primitive type RunSpeed <: Enum{Int32} 32\n\nWrapper around the upstream ImGuiTestRunSpeed. Possible values:\n\nRunSpeed_Fast\nRunSpeed_Normal\nRunSpeed_Cinematic\n\n\n\n\n\n","category":"type"},{"location":"api/#Registering-tests","page":"API","title":"Registering tests","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Once the engine is set up you can register some tests for it to run:","category":"page"},{"location":"api/","page":"API","title":"API","text":"ImGuiTest\n@register_test","category":"page"},{"location":"api/#ImGuiTestEngine.ImGuiTest","page":"API","title":"ImGuiTestEngine.ImGuiTest","text":"mutable struct ImGuiTest\n\nWrapper around the upstream ImGuiTest. Don't create this yourself, use @register_test(). Once it's created you can assign functions to these properties:\n\nGuiFunc::Function, for standalone GUI code that you want to run/test. This shouldn't be necessary if you're testing your own GUI.\nTestFunc::Function, for tests that you want to execute.\n\nThe functions you assign must take in one argument to a TestContext.\n\ndanger: Danger\nThis a memory-unsafe type, only use it while the engine is alive.\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.@register_test","page":"API","title":"ImGuiTestEngine.@register_test","text":"@register_test(engine, category::AbstractString, name::AbstractString)::ImGuiTest\n@register_test(f::Function, engine,\n               category::AbstractString, name::AbstractString)::ImGuiTest\n\nRegister a ImGuiTest. Note that it will not be executed until the test is queued, either programmatically with QueueTests() or by the user running it manually through ShowTestEngineWindows().\n\nExamples\n\nIf you only need to set TestFunc you can use do-syntax:\n\nengine = te.CreateContext()\n@register_test(engine, \"foo\", \"bar\") do ctx\n    @imtest ctx isa te.TestContext\nend\n\nTo set GuiFunc as well you'll need to set the GuiFunc property:\n\nengine = te.CreateContext()\nt = @register_test(engine, \"foo\", \"bar\")\nt.GuiFunc = ctx -> begin\n    ig.Begin(\"Foo\")\n    ig.End()\nend\nt.TestFunc = ctx -> @info \"Hello world!\"\n\n\n\n\n\n","category":"macro"},{"location":"api/#Test-context","page":"API","title":"Test context","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Inside GuiFunc and TestFunc you can use any methods of the test context API to control and test the GUI. It's not safe to use them outside of a GuiFunc/TestFunc.","category":"page"},{"location":"api/","page":"API","title":"API","text":"Note that even though GuiFunc/TestFunc are passed a TestContext object, it's never necessary to pass it explicitly to any of the methods below because we do some magic to automatically get the right TestContext in the current scope. e.g. SetRef(ctx, \"My window\") is fine, but it'll do the same thing as SetRef(\"My window\").","category":"page"},{"location":"api/","page":"API","title":"API","text":"note: Note\nLoads of test context methods are missing Julia wrappers, feel free to open an issue or contribute them yourself if you're missing one.If you want to try calling the wrapped C++ functions directly, it'll probably boil down to something like:te.lib.Thing(ctx, te.lib.ImGuiTestRef(\"my ref\"))","category":"page"},{"location":"api/","page":"API","title":"API","text":"TestContext\n@imcheck\n@imcheck_noret\nSetRef\nGetRef\nMouseClick\nMouseMove\nItemOpen\nItemClose\nOpenAndClose\nItemClick\nItemDoubleClick\nItemCheck\nMenuClick\nComboClick\nComboClickAll\nGetWindowByRef\nYield","category":"page"},{"location":"api/#ImGuiTestEngine.TestContext","page":"API","title":"ImGuiTestEngine.TestContext","text":"struct CxxPtr{ImGuiTestEngine.lib.ImGuiTestContext} <: CxxWrap.CxxWrapCore.CxxBaseRef{ImGuiTestEngine.lib.ImGuiTestContext}\n\nThis is a reference to a ImGuiTestContext. It cannot be created directly, instead the context will be passed to the GuiFunc and TestFunc functions of an ImGuiTest.\n\ndanger: Danger\nThis a memory-unsafe type, only use it while the engine is alive.\n\n\n\n\n\n","category":"type"},{"location":"api/#ImGuiTestEngine.@imcheck","page":"API","title":"ImGuiTestEngine.@imcheck","text":"@imcheck expr\n\nA port of the upstream IM_CHECK() macro. Like the upstream macro, this will return early from the calling function if expr evaluates to false. Prefer using it over @test because it will register test results with the test engine, which can be convenient if you're using the built-in test engine window (see ShowTestEngineWindows()).\n\n@imcheck hooks into @testset's by default, so a failure will be recorded with your Julia Test tests as well as with the test engine. If this is not wanted it can be disabled by passing jltest=false.\n\nnote: Note\nA limitation of the current implementation is that nicely parsing the expression, e.g. to display both arguments of an equality, is not supported.\n\nExamples\n\nengine = te.CreateContext()\n@register_test(engine, \"foo\", \"bar\") do ctx\n    # This record the result with `Test` as well as the test engine\n    @imcheck false\n\n    # This will only record the result with the test engine\n    @imcheck false jltest=false\nend\n\n\n\n\n\n","category":"macro"},{"location":"api/#ImGuiTestEngine.@imcheck_noret","page":"API","title":"ImGuiTestEngine.@imcheck_noret","text":"@imcheck_noret expr\n\nSame as @imcheck, except that it will not return early from the calling function.\n\n\n\n\n\n","category":"macro"},{"location":"api/#ImGuiTestEngine.SetRef","page":"API","title":"ImGuiTestEngine.SetRef","text":"SetRef(test_ref::Union{Int64, String})\nSetRef(test_ref::Union{Int64, String}, ctx)\n\n\nSet the current reference. For more information on references see the upstream documentation.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    SetRef(\"My Window\")\nend\n\nNote that test_ref is always treated as an absolute reference:\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    SetRef(\"My Window/quux\") # This will set the reference to `//My Window/quux`\n\n    # These two calls will not work\n    SetRef(\"My Window\") # Set the reference to `//My Window`\n    SetRef(\"quux\")      # Try to set the reference to `//quux`\nend\n\n\n\n\n\nSetRef(window::Ptr{CImGui.lib.ImGuiWindow})\nSetRef(window::Ptr{CImGui.lib.ImGuiWindow}, ctx)\n\n\nSame as SetRef(::TestRef), except it takes an explicit window to set a reference to.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    window = GetWindowByRef(\"Window\")\n    SetRef(window)\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.GetRef","page":"API","title":"ImGuiTestEngine.GetRef","text":"GetRef(\n\n) -> NamedTuple{(:id, :path), <:Tuple{UInt32, Union{Nothing, String}}}\nGetRef(\n    ctx\n) -> NamedTuple{(:id, :path), <:Tuple{UInt32, Union{Nothing, String}}}\n\n\nGet the current reference, with id and path properties.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    x = GetRef()\n    @show x.id x.path\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.MouseClick","page":"API","title":"ImGuiTestEngine.MouseClick","text":"MouseClick()\nMouseClick(button::CImGui.lib.ImGuiMouseButton_)\nMouseClick(button::CImGui.lib.ImGuiMouseButton_, ctx)\n\n\nRegister a click of button.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    MouseClick()                          # LMB\n    MouseClick(ig.ImGuiMouseButton_Right) # RMB\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.MouseMove","page":"API","title":"ImGuiTestEngine.MouseMove","text":"MouseMove(test_ref::Union{Int64, String})\nMouseMove(test_ref::Union{Int64, String}, ctx)\n\n\nMove the mouse to test_ref.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    MouseMove(\"My button\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ItemOpen","page":"API","title":"ImGuiTestEngine.ItemOpen","text":"ItemOpen(test_ref::Union{Int64, String})\nItemOpen(test_ref::Union{Int64, String}, flags)\nItemOpen(test_ref::Union{Int64, String}, flags, ctx)\n\n\nEnsure an item is opened.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ItemOpen(\"My menu\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ItemClose","page":"API","title":"ImGuiTestEngine.ItemClose","text":"ItemClose(test_ref::Union{Int64, String})\nItemClose(test_ref::Union{Int64, String}, flags)\nItemClose(test_ref::Union{Int64, String}, flags, ctx)\n\n\nEnsure an item is closed.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ItemClose(\"My menu\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.OpenAndClose","page":"API","title":"ImGuiTestEngine.OpenAndClose","text":"OpenAndClose(f, test_ref::Union{Int64, String})\nOpenAndClose(f, test_ref::Union{Int64, String}, ctx)\n\n\nA helper function that will ensure test_ref is open, execute f(), and close test_ref again. A typical use would be to open a section, run some tests, and then close the section again (handy for re-runnable tests).\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    OpenAndClose(\"My section\") do\n        # ...\n    end\nend\n\n\n\n\n\nOpenAndClose(test_ref::Union{Int64, String})\nOpenAndClose(test_ref::Union{Int64, String}, ctx)\n\n\nOpen and then close test_ref.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    OpenAndClose(\"My section\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ItemClick","page":"API","title":"ImGuiTestEngine.ItemClick","text":"ItemClick(test_ref::Union{Int64, String})\nItemClick(\n    test_ref::Union{Int64, String},\n    button::CImGui.lib.ImGuiMouseButton_\n)\nItemClick(\n    test_ref::Union{Int64, String},\n    button::CImGui.lib.ImGuiMouseButton_,\n    ctx\n)\n\n\nSimulate a click on the reference.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ItemClick(\"My button\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ItemDoubleClick","page":"API","title":"ImGuiTestEngine.ItemDoubleClick","text":"ItemDoubleClick(test_ref::Union{Int64, String})\nItemDoubleClick(test_ref::Union{Int64, String}, ctx)\n\n\nSimulate a double-click on the reference.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ItemDoubleClick(\"My selectable\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ItemCheck","page":"API","title":"ImGuiTestEngine.ItemCheck","text":"ItemCheck(test_ref::Union{Int64, String})\nItemCheck(test_ref::Union{Int64, String}, ctx)\n\n\nCheck an item.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ItemCheck(\"My checkbox\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.MenuClick","page":"API","title":"ImGuiTestEngine.MenuClick","text":"MenuClick(test_ref::Union{Int64, String})\nMenuClick(test_ref::Union{Int64, String}, ctx)\n\n\nClick on a menu item.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    MenuClick(\"My menu\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ComboClick","page":"API","title":"ImGuiTestEngine.ComboClick","text":"ComboClick(test_ref::Union{Int64, String})\nComboClick(test_ref::Union{Int64, String}, ctx)\n\n\nClick on a combo box item.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ComboClick(\"My combo/Item 1\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.ComboClickAll","page":"API","title":"ImGuiTestEngine.ComboClickAll","text":"ComboClickAll(test_ref::Union{Int64, String})\nComboClickAll(test_ref::Union{Int64, String}, ctx)\n\n\nClick on all items in a combo box.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    ComboClickAll(\"My combo\")\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.GetWindowByRef","page":"API","title":"ImGuiTestEngine.GetWindowByRef","text":"GetWindowByRef(\n    test_ref::Union{Int64, String}\n) -> Union{Nothing, Ptr{CImGui.lib.ImGuiWindow}}\nGetWindowByRef(\n    test_ref::Union{Int64, String},\n    ctx\n) -> Union{Nothing, Ptr{CImGui.lib.ImGuiWindow}}\n\n\nRetrieve a ImGuiWindow by reference. This will return nothing if the window was not found.\n\nExamples\n\n@register_test(engine, \"foo\", \"bar\") do ctx\n    window_ptr = GetWindowByRef(\"My window\")\n    @show window_ptr\nend\n\n\n\n\n\n","category":"function"},{"location":"api/#ImGuiTestEngine.Yield","page":"API","title":"ImGuiTestEngine.Yield","text":"Yield()\nYield(count::Int64)\nYield(count::Int64, ctx)\n\n\nYield to the application renderloop for count number of frames (defaults to 1). This is useful if you need to wait for more frames to be drawn for some action to occur (e.g. waiting for a window to appear after checking a checkbox).\n\n\n\n\n\n","category":"function"},{"location":"_changelog/","page":"Changelog","title":"Changelog","text":"CurrentModule = ImGuiTestEngine","category":"page"},{"location":"_changelog/#Changelog","page":"Changelog","title":"Changelog","text":"","category":"section"},{"location":"_changelog/","page":"Changelog","title":"Changelog","text":"This documents notable changes in ImGuiTestEngine.jl. The format is based on Keep a Changelog.","category":"page"},{"location":"_changelog/#[v1.0.0]-2024-09-03","page":"Changelog","title":"[v1.0.0] - 2024-09-03","text":"","category":"section"},{"location":"_changelog/","page":"Changelog","title":"Changelog","text":"This release is compatible with CImGui.jl v2 and v3.","category":"page"},{"location":"_changelog/#Added","page":"Changelog","title":"Added","text":"","category":"section"},{"location":"_changelog/","page":"Changelog","title":"Changelog","text":"Bindings for ComboClick() and ComboClickAll() ([#4]).\nBindings for MouseClick(), MouseMove(), ItemOpen(), ItemClose(), and a helper OpenAndClose() ([#5]).","category":"page"},{"location":"_changelog/#Changed","page":"Changelog","title":"Changed","text":"","category":"section"},{"location":"_changelog/","page":"Changelog","title":"Changelog","text":"ItemClick() now supports passing a button argument to select which button to click ([#5]).","category":"page"},{"location":"_changelog/#[v0.1.0]-2024-06-27","page":"Changelog","title":"[v0.1.0] - 2024-06-27","text":"","category":"section"},{"location":"_changelog/","page":"Changelog","title":"Changelog","text":"The initial release!","category":"page"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"EditURL = \"https://github.com/JuliaImGui/ImGuiTestEngine.jl/blob/master/CHANGELOG.md\"","category":"page"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"CurrentModule = ImGuiTestEngine","category":"page"},{"location":"changelog/#Changelog","page":"Changelog","title":"Changelog","text":"","category":"section"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"This documents notable changes in ImGuiTestEngine.jl. The format is based on Keep a Changelog.","category":"page"},{"location":"changelog/#[v1.0.0](https://github.com/JuliaImGui/ImGuiTestEngine.jl/releases/tag/v1.0.0)-2024-09-03","page":"Changelog","title":"v1.0.0 - 2024-09-03","text":"","category":"section"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"This release is compatible with CImGui.jl v2 and v3.","category":"page"},{"location":"changelog/#Added","page":"Changelog","title":"Added","text":"","category":"section"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"Bindings for ComboClick() and ComboClickAll() (#4).\nBindings for MouseClick(), MouseMove(), ItemOpen(), ItemClose(), and a helper OpenAndClose() (#5).","category":"page"},{"location":"changelog/#Changed","page":"Changelog","title":"Changed","text":"","category":"section"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"ItemClick() now supports passing a button argument to select which button to click (#5).","category":"page"},{"location":"changelog/#[v0.1.0](https://github.com/JuliaImGui/ImGuiTestEngine.jl/releases/tag/v0.1.0)-2024-06-27","page":"Changelog","title":"v0.1.0 - 2024-06-27","text":"","category":"section"},{"location":"changelog/","page":"Changelog","title":"Changelog","text":"The initial release!","category":"page"},{"location":"","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"CurrentModule = ImGuiTestEngine","category":"page"},{"location":"#ImGuiTestEngine.jl","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"","category":"section"},{"location":"","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"This package provides Julia bindings for the Dear ImGui test engine, a testing and automation library for Dear ImGui. It's designed to be used with programs written with CImGui.jl.","category":"page"},{"location":"","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"Known issues:","category":"page"},{"location":"","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"Some parts of the integration with @imcheck and the stdlib Test are incomplete.\nMany functions don't have Julia bindings yet (though adding them is fairly straightforward).","category":"page"},{"location":"","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"Here's a quick example:","category":"page"},{"location":"","page":"ImGuiTestEngine.jl","title":"ImGuiTestEngine.jl","text":"# Imports that we'll be using\nusing ImGuiTestEngine\nimport ImGuiTestEngine as te\nimport CImGui as ig\n\n# Set up the backend for CImGui\nimport GLFW\nimport ModernGL\nig.backend = :GlfwOpenGL\n\n# Create the ImGui context and test engine instance\nctx = ig.CreateContext()\nengine = te.CreateContext(; exit_on_completion=false)\n\n# Make them run at a humanly-visible speed\nengine_io = te.GetIO(engine)\nengine_io.ConfigRunSpeed = te.RunSpeed_Normal\n\n# Create a test that'll click a button\nclicked = false\n@register_test(engine, \"foo\", \"bar\") do ctx\n    SetRef(\"Foo\")\n    ItemClick(\"Click me\")\n    @imcheck clicked\nend\n\n# Start the renderloop, this is where your program should be running. Note that\n# we pass the engine to the renderloop, it will take care of starting and\n# queueing the engine.\nig.render(ctx; engine) do\n    ig.Begin(\"Foo\")\n    ig.Text(\"Hello world!\")\n    if ig.Button(\"Click me\")\n        @info \"Hello world!\"\n        global clicked = true\n    end\n    ig.End()\nend\n\n# Note that we don't need to explictly destroy `ctx` because `ig.render()` will\n# do it for us.\nte.Stop(engine)\nte.DestroyContext(engine)","category":"page"}]
}

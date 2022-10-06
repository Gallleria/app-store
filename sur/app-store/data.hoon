::  working on Milestone 2
|%
::
+$  usr-data  (map cur-name cur-page)
::
::
::
::  Cur Page
::
::
+$  cur-page  (unit [=cur-name =cur-title =cur-intro =cur-choice])
::
+$  cur-name  @p
+$  cur-title  @t
+$  cur-intro  @t
::
+$  cur-data
  $|  [=cur-choice =cur-map =aux-map]
  |=  [=cur-choice =cur-map =aux-map]
  =/  len1  (lent `dev-app-list`dev-app-list.cur-choice)
  =/  len2  (lent `app-page-list`app-page-list.cur-choice)
  =/  len3  (lent `cat-list`cat-list.cur-choice)
  ?.  &(=(len1 len2) =(len2 len3))  %.n  ::  assert correct length amongst lists
  =/  n  0
  |-  ::assert cur-choice is subset of cur-map
    ?:  =(n len1)  %.y
    ?.    .=  
        (snag n app-page-list.cur-choice)
        (~(got by cur-map) (snag n dev-app-list.cur-choice))
      %.n
    $(n +(n))
  ::  TODO assert that aux-map and cur-map are correct together
::
+$  cur-choice  [=dev-app-list =app-page-list =cat-list]
::
+$  dev-app-list  (list [=dev-name =app-name])
+$  app-page-list  (list app-page)
+$  cat-list  (list category)
+$  category  @tas
::
+$  cur-map  (map [=dev-name =app-name] app-page)
+$  aux-map  (map dev-name (list app-name))
::
::
::  Dev Page
::
+$  dev-update  (unit [=change =dev-page])
::
+$  change   
  $%
    [%init ~]
    [%add [=dev-name =app-name]]
    [%edit [=dev-name =app-name]]
    [%del [=dev-name =app-name]] 
    [%wipe ~]
  ==
+$  dev-page  (map [=dev-name =app-name] app-page)  ::  dev-name is the same in all keys
:: 
+$  dev-name  @p 
+$  app-name  @tas                   ::  up to 30 chars long on Apple Store
::
+$  app-page
  $: 
  ::
    description=@t
    keywords=(list keyword)          ::  limited to 100 characters total, input with terms
                                     ::  separated by commas and no spaces. For example:         
                                     ::  Property,House,Real Estate
    screenshots=(list screenshot)    ::  up to 10 screenshots on Apple Store
    =visitor-data
    =auxiliary-data
    =docket-data
  == 
::
::
+$  keyword  @tas
::
+$  screenshot  @t
::
+$  visitor-data
  $:
    avg-rating=@rh
    ratings=(map @p rating)
    comments=(list comment)
    reviews=(map reviewer review)
  ==
::
::                                   ::  nothing automatically yet except docket 
::
+$  auxiliary-data                   ::  (automatically find what's easy to find)
  $:
    desk-hash=@uv    
    ::  installed-into=@tas          ::  is this same as base in docket data?
    developer-desk=@t                ::  link is made from this
    last-update=@da
    release-date=@da                 ::  should it be documented or no? (ask hodzod)
    size-mb=@rs
  ==
::
::
+$  docket-data                      ::  should it automatically add it from docket file?
  $:
    title=@t
    info=@t                          ::  subtitle/summary, up to 30 chars long in apple
    color=@ux                        ::    store, here maybe it can be longer?
    version=[@ud @ud @ud]
    website=@t
    license=@t
    base=@t                          ::  same as installed into(@tas)?
    image=@t                         ::  app icon, should be square
  ==                                 ::  To ensure the icon is legible in all sizes, 
::                                   ::  avoid adding unnecessary visual details
+$  rating  
  $|  @ud  
  |=  rating=@ud 
  &((lte rating 5) (gte rating 1))
::
+$  comment 
  $:
    commenter=@p
    date=@da
    text=@t
  ==
::
+$  reviewer  @p
+$  review
  $:
    date=@da
    text=@t
    hash=@uv
    is-current=?    
    is-safe=?                        ::  3rd possibility as no decision?
  ==
::
--


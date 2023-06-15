/-  *portal-data, *portal-config, gr=social-graph
|%
::
::  units are optional args
+$  action
  $%  $:  %create
         ship=(unit ship)
         cord=(unit cord)
         time=(unit cord)
         lens=(unit lens)
         bespoke=(unit bespoke)
         append-to=(list [struc=%collection =ship =cord time=cord])
         ::  TODO try $>(%collection key), probably wont work tho
         prepend-to-feed=(list [struc=%feed =ship =cord time=cord])
         ::  in %portal use case, tag should look like /[ship]/whatever
         tags-to=(list [=key tag-to=path tag-from=path])
      ==
      ::
      $:  %edit
        $:  =key
            lens=(unit lens)
            $=  bespoke  %-  unit
              $%  [%other title=(unit @t) blurb=(unit @t) link=(unit @t) image=(unit @t)]
                  [%app screenshots=(unit (list @t)) blurb=(unit @t) dist-desk=(unit @t) sig=(unit signature) treaty=(unit treaty)]
                  [%collection title=(unit @t) blurb=(unit @t) image=(unit @t) key-list=(unit key-list)]  ::does it need link?
                  [%feed feed=(unit feed)]
                  [%retweet blurb=(unit @t) ref=(unit key)]
                  [%blog title=(unit @t) blurb=(unit @t) uri=(unit @t) path=(unit @t) image=(unit @t)]
              ==
        ==
      ==
      ::
      [%add-tag-request from=key to=key tag-from=path tag-to=path]
      ::
      [%replace =key =lens =bespoke]  ::  TODO should it act like put or edit?, i.e. can it create a nonexisting item. NO! (?)
      ::
      [%add-tag-request our=key their=key tag-to=path tag-from=path]
      ::      
      [%append =key-list col-key=[struc=%collection =ship =cord time=cord]]
      [%prepend =key-list col-key=[struc=%collection =ship =cord time=cord]]
      ::  removes all instances of key from collection
      [%remove =key-list col-key=[struc=%collection =ship =cord time=cord]]
      ::
      [%delete =key]  ::  adds [%deleted ~] lens
      [%destroy =key]  :: abolishes the item from the atmosphere
      ::
      [%sub =key]
      [%sub-to-item =key]
      ::
      ::
      [%prepend-to-feed =feed feed-key=[struc=%feed =ship =cord time=cord]]  ::  TODO rename?
      [%index-as-curator toggle=?]
      [%onboarded toggle=?]
      [%blog-sub ~]
      ::
      [%manager-init ~]
      ::  ? purge needs to be defined as action?
      :: TODO make purge have only 'items-to-keep' arg
      [%purge portal-curator=@p]
    ==
--
